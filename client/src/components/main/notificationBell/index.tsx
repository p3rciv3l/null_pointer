import React, { useEffect, useRef, useState } from 'react';
import { Notification } from '../../../types';
import useUserContext from '../../../hooks/useUserContext';
import useNotifications from '../../../hooks/useNotifications';
import './index.css';

const BELL_ICON = '/assets/bell_icon.png';
const GREY_BELL_ICON = '/assets/grey_bell.png';

const NotificationBell: React.FC = () => {
  const { socket, user } = useUserContext();
  const { notifications, error } = useNotifications(user.username);
  const [localNotifications, setLocalNotifications] = useState<Notification[]>(notifications);
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!socket) {
      return () => {};
    }

    const handleNotification = (notification: Notification): void => {
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

  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (closeTimeout) {
      clearTimeout(closeTimeout);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCloseTimeout(
      setTimeout(() => {
        setIsOpen(false);
      }, 800),
    );
  };

  return (
    <div className='notification-container'>
      <div
        className='bell-icon-container'
        onClick={toggleDropdown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}>
        <img src={isHovered ? GREY_BELL_ICON : BELL_ICON} alt='notifications' />
        {localNotifications.length > 0 && (
          <span className='notification-count'>{localNotifications.length}</span>
        )}
      </div>
      {isOpen &&
        isHovered && ( // Show dropdown only if clicked and hovered
          <div className='notification-dropdown' ref={dropdownRef}>
            <div className='notification-header'>
              <h3>Notifications</h3>
              {localNotifications.length > 0 && (
                <button onClick={() => setLocalNotifications([])}>Clear all</button>
              )}
            </div>
            <div className='notification-list'>
              {localNotifications.length === 0 ? (
                <div className='notification-empty'>No new notifications</div>
              ) : (
                localNotifications.map(notif => (
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
