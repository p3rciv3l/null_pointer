import mongoose, { Model } from 'mongoose';
import answerSchema from './schema/answer';
import { Profile } from '../types';
import profileSchema from './schema/profile';

/**
 * Mongoose model for the `Profile` collection.
 *
 * This model is created using the `Profile` interface and the `profileSchema`, representing the
 * `Profile` collection in the MongoDB database, and provides an interface for interacting with
 * the stored profiles.
 *
 * @type {Model<Profile>}
 */
const ProfileModel: Model<Profile> = mongoose.model<Profile>('Profile', profileSchema);

export default ProfileModel;
