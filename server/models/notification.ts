import mongoose, { Schema, Document } from 'mongoose';

export type NotificationType = 'reply' | 'vote' | 'question';

export interface INotification extends Document {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: Date;
  read: boolean;
  userId: string;
  relatedId: string;
}

const NotificationSchema = new Schema<INotification>({
  type: {
    type: String,
    enum: ['reply', 'vote', 'question'],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  read: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: String,
    required: true,
  },
  relatedId: {
    type: String,
    required: true,
  },
});

const Notification = mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
