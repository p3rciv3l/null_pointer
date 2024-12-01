import { Request, Response } from 'express';
import * as NotificationService from '../services/notificationService';
import { getNotifications, readNotification, addNotification } from '../controller/notification';

jest.mock('../services/notificationService');

describe('Notifications Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn();
    mockReq = {};
    mockRes = {
      status: statusMock,
      json: jsonMock,
    };
    jest.clearAllMocks();
  });

  describe('getNotifications', () => {
    it('should return 400 if userId is not provided', async () => {
      mockReq.params = {};

      await getNotifications(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'User ID is required' });
    });

    it('should return notifications if userId is valid', async () => {
      const mockNotifications = [
        {
          _id: '123',
          type: 'info',
          message: 'Test notification',
          timestamp: new Date(),
          read: false,
          userId: 'user1',
          relatedId: 'related1',
        },
      ];
      (NotificationService.getNotifications as jest.Mock).mockResolvedValue(mockNotifications);

      mockReq.params = { userId: 'user1' };

      await getNotifications(mockReq as Request, mockRes as Response);

      expect(NotificationService.getNotifications).toHaveBeenCalledWith('user1');
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith([
        {
          id: '123',
          type: 'info',
          message: 'Test notification',
          timestamp: mockNotifications[0].timestamp.toISOString(),
          read: false,
          userId: 'user1',
          relatedId: 'related1',
        },
      ]);
    });

    it('should return 500 if an error occurs', async () => {
      (NotificationService.getNotifications as jest.Mock).mockRejectedValue(
        new Error('Service error'),
      );

      mockReq.params = { userId: 'user1' };

      await getNotifications(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('readNotification', () => {
    it('should return 400 if notificationId is not provided', async () => {
      mockReq.params = {};

      await readNotification(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Notification ID is required' });
    });

    it('should return 404 if notification is not found', async () => {
      (NotificationService.markAsRead as jest.Mock).mockResolvedValue(null);

      mockReq.params = { notificationId: '123' };

      await readNotification(mockReq as Request, mockRes as Response);

      expect(NotificationService.markAsRead).toHaveBeenCalledWith('123');
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Notification not found' });
    });

    it('should mark a notification as read successfully', async () => {
      const mockNotification = {
        _id: '123',
        type: 'info',
        message: 'Test notification',
        timestamp: new Date(),
        read: true,
        userId: 'user1',
        relatedId: 'related1',
      };
      (NotificationService.markAsRead as jest.Mock).mockResolvedValue(mockNotification);

      mockReq.params = { notificationId: '123' };

      await readNotification(mockReq as Request, mockRes as Response);

      expect(NotificationService.markAsRead).toHaveBeenCalledWith('123');
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        id: '123',
        type: 'info',
        message: 'Test notification',
        timestamp: mockNotification.timestamp.toISOString(),
        read: true,
        userId: 'user1',
        relatedId: 'related1',
      });
    });

    it('should return 500 if an error occurs', async () => {
      (NotificationService.markAsRead as jest.Mock).mockRejectedValue(new Error('Service error'));

      mockReq.params = { notificationId: '123' };

      await readNotification(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('addNotification', () => {
    it('should return 400 if required fields are missing', async () => {
      mockReq.body = {};

      await addNotification(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'userId, message, type, and relatedId are required',
      });
    });

    it('should create a notification successfully', async () => {
      const mockNotification = {
        _id: '123',
        type: 'info',
        message: 'Test notification',
        timestamp: new Date(),
        read: false,
        userId: 'user1',
        relatedId: 'related1',
      };
      (NotificationService.createNotification as jest.Mock).mockResolvedValue(mockNotification);

      mockReq.body = {
        userId: 'user1',
        message: 'Test notification',
        type: 'info',
        relatedId: 'related1',
      };

      await addNotification(mockReq as Request, mockRes as Response);

      expect(NotificationService.createNotification).toHaveBeenCalledWith({
        userId: 'user1',
        message: 'Test notification',
        type: 'info',
        relatedId: 'related1',
      });
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        id: '123',
        type: 'info',
        message: 'Test notification',
        timestamp: mockNotification.timestamp.toISOString(),
        read: false,
        userId: 'user1',
        relatedId: 'related1',
      });
    });

    it('should return 500 if an error occurs', async () => {
      (NotificationService.createNotification as jest.Mock).mockRejectedValue(
        new Error('Service error'),
      );

      mockReq.body = {
        userId: 'user1',
        message: 'Test notification',
        type: 'info',
        relatedId: 'related1',
      };

      await addNotification(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });
});
