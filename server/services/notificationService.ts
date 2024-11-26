import Notification, { NotificationType, INotification } from '../models/notification';

interface CreateNotificationParams {
  userId: string;
  message: string;
  type: NotificationType;
  relatedId: string;
}

export const createNotification = async (notification: INotification) => notification.save();

export const getNotifications = async (userId: string): Promise<INotification[]> => {
  return await Notification.find({ userId }).sort({ timestamp: -1 }).exec();
};

export const markAsRead = async (notificationId: string): Promise<INotification | null> => {
  return await Notification.findByIdAndUpdate(notificationId, { read: true }, { new: true }).exec();
};
