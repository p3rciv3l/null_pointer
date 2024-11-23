import React, { useState, useEffect, useRef } from 'react';
const bellIcon = '/assets/bell.png';
const greyBellIcon = '/assets/grey_bell.png';
import useUserContext from '../../../hooks/useUserContext';
import { Notification } from '../../../types';
import './index.css';

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isGrey, setIsGrey] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { socket, user } = useUserContext();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setIsGrey(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (notification: Notification) => {
      if (notification.userId === user.username) {
        setNotifications(prev => [...prev, notification]);
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
      <div
        className='bell-icon-container'
        onClick={() => {
          setShowDropdown(!showDropdown);
          setIsGrey(!isGrey);
        }}
        onMouseEnter={() => setIsGrey(true)}
        onMouseLeave={() => !showDropdown && setIsGrey(false)}>
        <img src={isGrey ? greyBellIcon : bellIcon} alt='notifications' />
        {notifications.length > 0 && (
          <span className='notification-count'>{notifications.length}</span>
        )}
      </div>
      {showDropdown && (
        <div className='notification-dropdown' ref={dropdownRef}>
          <div className='notification-header'>
            <h3>Notifications</h3>
            {notifications.length > 0 && (
              <button onClick={() => setNotifications([])}>Clear all</button>
            )}
          </div>
          <div className='notification-list'>
            {notifications.length === 0 ? (
              <div className='notification-empty'>No new notifications</div>
            ) : (
              notifications.map(notif => (
                <div key={notif.id} className={`notification-item ${notif.read ? 'read' : ''}`}>
                  <span className='notification-icon'>{getNotificationIcon(notif.type)}</span>
                  <span className='notification-message'>{notif.message}</span>
                  <span className='notification-timestamp'>
                    {new Date(notif.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
