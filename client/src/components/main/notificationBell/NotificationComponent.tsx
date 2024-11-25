import React from 'react';
import { Notification } from '../../../types';

interface NotificationComponentProps {
  notifications: Notification[];
  error: string | null;
}

const NotificationComponent: React.FC<NotificationComponentProps> = ({ notifications, error }) => (
  <div>
    {error && <div className='error-notification'>{error}</div>}
    {/* Render notifications here */}
  </div>
);

export default NotificationComponent;
