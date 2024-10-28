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
 * - 'numAnswers' - The number of answers the user has submitted.
 * - 'numQuestions' - The number of questions the user has submitted.
 * - 'reputation' - The rank of the user in the stack community.
 * - 'joinedWhen' - How long the user has created this Profile for.
 * - 'score' - An integer score calculated based on number of upvotes and downvotes receieved.
 * - 'numDownvotes' - The number of downvotes the user has ever recieved.
 * - 'numUpvotes' - The number of upvotes the user has ever recieved.
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
  },
  bio: {
    type: String,
    maxlength: 500,
  },
  numAnswers: {
    type: Number,
    default: 0,
    min: 0,
  },
  numQuestions: {
    type: Number,
    default: 0,
    min: 0,
  },
  numDownvotes: {
    type: Number,
    default: 0,
    min: 0,
  },
  numUpvotes: {
    type: Number,
    default: 0,
    min: 0,
  },
  reputation: {
    type: Number,
  },
  score: {
    type: Number,
    default: 0,
  },
  joinedWhen: {
    type: Date,
    default: Date.now,
  },
});

export default profileSchema;
