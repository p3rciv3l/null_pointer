import Notification, { NotificationType, INotification } from '../models/notification';

interface CreateNotificationParams {
  userId: string;
  message: string;
  type: NotificationType;
  relatedId: string;
}

export const createNotification = async (
  params: CreateNotificationParams,
): Promise<INotification> => {
  const notification = new Notification({
    userId: params.userId,
    message: params.message,
    type: params.type,
    relatedId: params.relatedId,
    read: false,
    timestamp: new Date(),
  });
  return notification.save();
};

export const getNotifications = async (userId: string): Promise<INotification[]> =>
  Notification.find({ userId }).sort({ timestamp: -1 }).exec();

export const markAsRead = async (notificationId: string): Promise<INotification | null> =>
  Notification.findByIdAndUpdate(notificationId, { read: true }, { new: true }).exec();
