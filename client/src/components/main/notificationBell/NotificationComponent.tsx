import React from 'react';
import { Notification } from '../../../types';

interface NotificationComponentProps {
  notifications: Notification[];
  error: string | null;
  loading?: boolean;
}

const NotificationComponent: React.FC<NotificationComponentProps> = ({
  notifications,
  error,
  loading,
}) => (
  <div className='notifications-container'>
    {loading && <div className='loading'>Loading notifications...</div>}
    {error && <div className='error-notification'>{error}</div>}
    {notifications.length === 0 && !loading && !error && (
      <div className='no-notifications'>No notifications</div>
    )}
    {notifications.map(notification => (
      <div
        key={notification.id}
        className={`notification-item ${notification.read ? 'read' : 'unread'}`}>
        <div className='notification-type'>{notification.type}</div>
        <div className='notification-message'>{notification.message}</div>
        <div className='notification-time'>{new Date(notification.timestamp).toLocaleString()}</div>
      </div>
    ))}
  </div>
);

export default NotificationComponent;
