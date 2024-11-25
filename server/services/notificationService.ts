import Notification from '../models/notification';

/**
 * Fetch notifications for a specific user.
 * @param userId - The ID of the user.
 * @returns A promise that resolves to an array of notifications.
 */
export const getNotificationsByUserId = async (userId: string) => {
  console.log('Fetching notifications for user ID:', userId);
  return Notification.find({ userId }).sort({ timestamp: -1 });
};

/**
 * Mark a notification as read.
 * @param notificationId - The ID of the notification.
 * @returns A promise that resolves to the updated notification.
 */
export const markNotificationAsRead = async (notificationId: string) => {
  return Notification.findByIdAndUpdate(notificationId, { read: true }, { new: true });
};

/**
 * Create a new notification.
 * @param notificationData - The data for the new notification.
 * @returns A promise that resolves to the created notification.
 */
export const createNotification = async (notificationData: Partial<Notification>) => {
  const notification = new Notification(notificationData);
  return notification.save();
};
