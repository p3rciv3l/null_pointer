import { Request, Response } from 'express';
import * as NotificationService from '../services/notificationService';

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const notifications = await NotificationService.getNotifications(userId);
    const transformedNotifications = notifications.map(n => ({
      id: n._id.toString(),
      type: n.type,
      message: n.message,
      timestamp: n.timestamp.toISOString(),
      read: n.read,
      userId: n.userId,
      relatedId: n.relatedId,
    }));

    return res.status(200).json(transformedNotifications);
  } catch (error) {
    console.error('Error in getNotifications controller:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const readNotification = async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;
    if (!notificationId) {
      return res.status(400).json({ message: 'Notification ID is required' });
    }

    const updatedNotification = await NotificationService.markAsRead(notificationId);
    if (!updatedNotification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    return res.status(200).json({
      id: updatedNotification._id.toString(),
      type: updatedNotification.type,
      message: updatedNotification.message,
      timestamp: updatedNotification.timestamp.toISOString(),
      read: updatedNotification.read,
      userId: updatedNotification.userId,
      relatedId: updatedNotification.relatedId,
    });
  } catch (error) {
    console.error('Error in readNotification controller:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const addNotification = async (req: Request, res: Response) => {
  try {
    const { userId, message, type, relatedId } = req.body;
    if (!userId || !message || !type || !relatedId) {
      return res.status(400).json({
        message: 'userId, message, type, and relatedId are required',
      });
    }

    const newNotification = await NotificationService.createNotification({
      userId,
      message,
      type,
      relatedId,
    });

    return res.status(201).json({
      id: newNotification._id.toString(),
      type: newNotification.type,
      message: newNotification.message,
      timestamp: newNotification.timestamp.toISOString(),
      read: newNotification.read,
      userId: newNotification.userId,
      relatedId: newNotification.relatedId,
    });
  } catch (error) {
    console.error('Error in addNotification controller:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
