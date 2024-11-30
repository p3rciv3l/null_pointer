import mongoose, { Schema, Document, Types } from 'mongoose';

export type NotificationType = 'reply' | 'vote' | 'question';

// Base interface for notification data
export interface INotificationBase {
  type: NotificationType;
  message: string;
  timestamp: Date;
  read: boolean;
  userId: string;
  relatedId: string;
}

// Interface that extends both the base interface and Mongoose Document
export interface INotification extends INotificationBase, Document {
  _id: Types.ObjectId;
}

const notificationSchema = new Schema<INotification>({
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

const notification = mongoose.model<INotification>('Notification', notificationSchema);

export default notification;
