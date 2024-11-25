import express from 'express';
import { getNotifications, readNotification, addNotification } from '../controller/notification';

const router = express.Router();

router.get('/notifications', getNotifications);
router.patch('/notifications/:notificationId/read', readNotification);
router.post('/notifications', addNotification);

export default router;
