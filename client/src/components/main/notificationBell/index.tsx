import React, { useState, useEffect, useRef } from 'react';
import useUserContext from '../../../hooks/useUserContext';
import useNotifications from '../../../hooks/useNotifications';
import { Notification } from '../../../types';
import './index.css';
import NotificationComponent from './NotificationComponent';

/* const BELL_ICON = '/bell_icon.png';
const GREY_BELL_ICON = '/grey_bell.png'; */
const BELL_ICON = '/assets/bell_icon.png';
const GREY_BELL_ICON = '/assets/grey_bell.png';

const NotificationBell: React.FC = () => {
  const { socket, user } = useUserContext();
  const { notifications, error } = useNotifications(user.username);
  const [localNotifications, setLocalNotifications] = useState<Notification[]>(notifications);
  const [isOpen, setIsOpen] = useState(false);
  const [isGrey, setIsGrey] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsGrey(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!socket) return undefined;

    const handleNotification = (notification: Notification) => {
      if (notification.userId === user.username) {
        setLocalNotifications(prev => [...prev, notification]);
      }
    };

    socket.on('notificationUpdate', handleNotification);

    return () => {
      socket.off('notificationUpdate', handleNotification);
    };
  }, [socket, user.username]);

  const getNotificationIcon = (type: 'reply' | 'vote' | 'question') => {
    switch (type) {
      case 'reply':
        return '💬';
      case 'vote':
        return '⭐';
      case 'question':
        return '❓';
      default:
        return '📢';
    }
  };

  return (
    <div className='notification-container'>
      <NotificationComponent notifications={localNotifications} error={error} />
      <div
        className='bell-icon-container'
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}>
        <img src={isGrey ? GREY_BELL_ICON : BELL_ICON} alt='notifications' />
        {localNotifications.length > 0 && (
          <span className='notification-count'>{localNotifications.length}</span>
        )}
      </div>
      {isOpen && (
        <div className='notification-dropdown' ref={dropdownRef}>
          <div className='notification-header'>
            <h3>Notifications</h3>
            {localNotifications.length > 0 && (
              <button onClick={() => setLocalNotifications([])}>Clear all</button>
            )}
          </div>
          <div className='notification-list'>
            {localNotifications.map(notif => (
              <div key={notif.id} className={`notification-item ${notif.read ? 'read' : ''}`}>
                <span className='notification-icon'>{getNotificationIcon(notif.type)}</span>
                <span className='notification-message'>{notif.message}</span>
                <span className='notification-timestamp'>
                  {new Date(notif.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
