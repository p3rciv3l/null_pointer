import Notification from '../models/notification';
import { createNotification, getNotifications, markAsRead } from '../services/notificationService';

jest.mock('../models/notification');

describe('Notification Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createNotification', () => {
    it('should create and save a new notification', async () => {
      const mockNotification = {
        userId: 'user123',
        message: 'Test message',
        type: 'reply',
        relatedId: 'related123',
        read: false,
        timestamp: new Date(),
      };

      const saveMock = jest.fn().mockResolvedValue(mockNotification);
      (Notification as unknown as jest.Mock).mockImplementation(() => ({ save: saveMock }));

      const result = await createNotification({
        userId: 'user123',
        message: 'Test message',
        type: 'reply',
        relatedId: 'related123',
      });

      expect(Notification).toHaveBeenCalledWith({
        userId: 'user123',
        message: 'Test message',
        type: 'reply',
        relatedId: 'related123',
        read: false,
        timestamp: expect.any(Date),
      });
      expect(saveMock).toHaveBeenCalled();
      expect(result).toEqual(mockNotification);
    });

    it('should throw an error if saving the notification fails', async () => {
      const saveMock = jest.fn().mockRejectedValue(new Error('Save failed'));
      (Notification as unknown as jest.Mock).mockImplementation(() => ({ save: saveMock }));

      await expect(
        createNotification({
          userId: 'user123',
          message: 'Test message',
          type: 'reply',
          relatedId: 'related123',
        }),
      ).rejects.toThrow('Save failed');

      expect(saveMock).toHaveBeenCalled();
    });
  });

  describe('getNotifications', () => {
    it('should fetch and sort notifications by timestamp in descending order', async () => {
      const mockNotifications = [
        { userId: 'user123', message: 'First notification', timestamp: new Date('2024-01-01') },
        { userId: 'user123', message: 'Second notification', timestamp: new Date('2024-02-01') },
      ];

      (Notification.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockNotifications),
        }),
      });

      const result = await getNotifications('user123');

      expect(Notification.find).toHaveBeenCalledWith({ userId: 'user123' });
      expect(result).toEqual(mockNotifications);
    });

    it('should return an empty array if no notifications are found', async () => {
      (Notification.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([]),
        }),
      });

      const result = await getNotifications('user123');

      expect(Notification.find).toHaveBeenCalledWith({ userId: 'user123' });
      expect(result).toEqual([]);
    });

    it('should throw an error if fetching notifications fails', async () => {
      (Notification.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockRejectedValue(new Error('Fetch failed')),
        }),
      });

      await expect(getNotifications('user123')).rejects.toThrow('Fetch failed');
    });
  });

  describe('markAsRead', () => {
    it('should mark a notification as read and return the updated notification', async () => {
      const mockNotification = {
        _id: 'notification123',
        userId: 'user123',
        message: 'Test notification',
        read: true,
        timestamp: new Date(),
      };

      (Notification.findByIdAndUpdate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockNotification),
      });

      const result = await markAsRead('notification123');

      expect(Notification.findByIdAndUpdate).toHaveBeenCalledWith(
        'notification123',
        { read: true },
        { new: true },
      );
      expect(result).toEqual(mockNotification);
    });

    it('should return null if the notification is not found', async () => {
      (Notification.findByIdAndUpdate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await markAsRead('notification123');

      expect(Notification.findByIdAndUpdate).toHaveBeenCalledWith(
        'notification123',
        { read: true },
        { new: true },
      );
      expect(result).toBeNull();
    });

    it('should throw an error if marking the notification as read fails', async () => {
      (Notification.findByIdAndUpdate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('Update failed')),
      });

      await expect(markAsRead('notification123')).rejects.toThrow('Update failed');
    });
  });
});
