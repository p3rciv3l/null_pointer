import { Request, Response } from 'express';
import {
  getNotificationsByUserId,
  markNotificationAsRead,
  createNotification,
} from '../services/notificationService';

/**
 * Get notifications for a user.
 */
export const getNotifications = async (req: Request, res: Response) => {
  console.log('Received request for notifications');
  const { userId } = req.query;
  console.log('User ID:', userId);

  if (!userId) {
    console.log('No User ID provided');
    return res.status(400).send('User ID is required');
  }

  try {
    const notifications = await getNotificationsByUserId(userId as string);
    console.log('Fetched notifications:', notifications);
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).send('Error fetching notifications');
  }
};

/**
 * Mark a notification as read.
 */
export const readNotification = async (req: Request, res: Response) => {
  const { notificationId } = req.params;
  try {
    const notification = await markNotificationAsRead(notificationId);
    res.json(notification);
  } catch (error) {
    res.status(500).send('Error marking notification as read');
  }
};

/**
 * Create a new notification.
 */
export const addNotification = async (req: Request, res: Response) => {
  try {
    const notification = await createNotification(req.body);
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).send('Error creating notification');
  }
};
