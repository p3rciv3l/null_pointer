import { Schema } from 'mongoose';

/**
 * Mongoose schema for the Profile datatype.
 *
 * This schema defines the structure of the Profile used in questions, answers,
 * and authentication.
 * Each Profile includes the following fields:
 * - 'username' - The username of the user.
 * - 'title' - The job title of the user.
 * - 'bio' - A short description about the user.
 * - 'answersGiven' - The list of answers the user has submitted.
 * - 'questionsAsked' - The list of questions the user has submitted.
 * - 'questionsUpvoted' - The list of questions the user has upvoted.
 * - 'answersUpvoted' - The list of answers the user has upvoted (When we add Answer upvote functionality).
 * - 'joinedWhen' - A Date corresponding to when the User created a Profile (created an account).
 */

const profileSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  title: {
    type: String,
    trim: true,
    default: '',
  },
  bio: {
    type: String,
    maxlength: 500,
    default: '',
  },
  answersGiven: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
    default: [],
  },
  questionsAsked: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    default: [],
  },

  questionsUpvoted: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    default: [],
  },

  answersUpvoted: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
    default: [],
  },
  joinedWhen: {
    type: Date,
    default: Date.now,
  },
  following: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Profile' }],
  },
});

export default profileSchema;
