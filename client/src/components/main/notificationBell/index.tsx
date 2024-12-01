import React, { useEffect, useRef, useState } from 'react';
import { Notification } from '../../../types';
import useUserContext from '../../../hooks/useUserContext';
import useNotifications from '../../../hooks/useNotifications';
import { useDropdown } from '../../../hooks/useDropdown';
import './index.css';

const BELL_ICON = '/assets/bell_icon.png';
const GREY_BELL_ICON = '/assets/grey_bell.png';

const NotificationBell: React.FC = () => {
  const { socket, user } = useUserContext();
  const { notifications } = useNotifications(user.username);
  const [localNotifications, setLocalNotifications] = useState<Notification[]>(notifications);
  const { isOpen, isHovered, handlers } = useDropdown();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket) {
      return undefined;
    }

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
    const icons = {
      reply: '💬',
      vote: '⭐',
      question: '❓',
    };
    return icons[type] || '📢';
  };

  return (
    <div
      ref={containerRef}
      className='notification-container'
      onMouseEnter={handlers.handleMouseEnter}
      onMouseLeave={handlers.handleMouseLeave}>
      <div className='bell-icon-container' onClick={handlers.handleClick}>
        <img src={isHovered ? GREY_BELL_ICON : BELL_ICON} alt='notifications' />
        {localNotifications.length > 0 && (
          <span className='notification-count'>{localNotifications.length}</span>
        )}
      </div>
      {isOpen && (
        <div className='notification-dropdown'>
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
