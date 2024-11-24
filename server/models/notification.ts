import mongoose, { Schema, Document } from 'mongoose';

interface NotificationDocument extends Document {
  type: string;
  message: string;
  timestamp: Date;
  read: boolean;
  userId: string;
  relatedId: string;
}

const NotificationSchema: Schema = new Schema({
  type: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
  userId: { type: String, required: true },
  relatedId: { type: String, required: true },
});

export default mongoose.model<NotificationDocument>('Notification', NotificationSchema);
