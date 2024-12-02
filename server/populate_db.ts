import mongoose, { Types } from 'mongoose';
import AnswerModel from './models/answers';
import QuestionModel from './models/questions';
import TagModel from './models/tags';
import { Answer, Comment, Profile, Question, Tag } from './types';
import {
  Q1_DESC,
  Q1_TXT,
  Q2_DESC,
  Q2_TXT,
  Q3_DESC,
  Q3_TXT,
  Q4_DESC,
  Q4_TXT,
  A1_TXT,
  A2_TXT,
  A3_TXT,
  A4_TXT,
  A5_TXT,
  A6_TXT,
  A7_TXT,
  A8_TXT,
  T1_NAME,
  T1_DESC,
  T2_NAME,
  T2_DESC,
  T3_NAME,
  T3_DESC,
  T4_NAME,
  T4_DESC,
  T5_NAME,
  T5_DESC,
  T6_NAME,
  T6_DESC,
  C1_TEXT,
  C2_TEXT,
  C3_TEXT,
  C4_TEXT,
  C5_TEXT,
  C6_TEXT,
  C7_TEXT,
  C8_TEXT,
  C9_TEXT,
  C10_TEXT,
  C11_TEXT,
  C12_TEXT,
  P1_BIO, 
  P2_BIO, 
  P3_BIO, 
  P4_BIO, 
  P5_BIO, 
  P6_BIO,
  P7_BIO,
  P8_BIO,
  P9_BIO,
  P10_BIO,
  P11_BIO,
  P1_TITLE,
  P2_TITLE,
  P3_TITLE,
  P4_TITLE,
  P5_TITLE,
  P6_TITLE,
  P7_TITLE,
  P8_TITLE,
  P9_TITLE,
  P10_TITLE,
  P11_TITLE,
  P12_TITLE,
  P12_BIO,
  C13_TEXT,
  C14_TEXT,
  C15_TEXT,
  C16_TEXT,
  Q5_DESC,
  Q5_TXT,
  Q6_DESC,
  Q6_TXT,
  Q7_DESC,
  Q7_TXT,
  Q8_DESC,
  Q8_TXT,
  T7_DESC,
  T7_NAME,
  T8_DESC,
  T8_NAME,
  T9_DESC,
  T9_NAME,
  A10_TXT,
  A11_TXT,
  A12_TXT,
  A9_TXT,
  P13_BIO,
  P13_TITLE,
  P14_BIO,
  P14_TITLE,
  P15_BIO,
  P15_TITLE,
  P16_BIO,
  P16_TITLE,
} from './data/posts_strings';
import CommentModel from './models/comments';
import ProfileModel from './models/profile';

// Pass URL of your mongoDB instance as first argument(e.g., mongodb://127.0.0.1:27017/fake_so)
const userArgs = process.argv.slice(2);

if (!userArgs[0].startsWith('mongodb')) {
  throw new Error('ERROR: You need to specify a valid mongodb URL as the first argument');
}

const mongoDB = userArgs[0];
mongoose.connect(mongoDB);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/**
 * Creates a new Tag document in the database.
 *
 * @param name The name of the tag.
 * @param description The description of the tag.
 * @returns A Promise that resolves to the created Tag document.
 * @throws An error if the name is empty.
 */
async function tagCreate(name: string, description: string): Promise<Tag> {
  if (name === '') throw new Error('Invalid Tag Format');
  const tag: Tag = { name: name, description: description };
  return await TagModel.create(tag);
}

/**
 * Creates a new Comment document in the database.
 *
 * @param text The content of the comment.
 * @param commentBy The username of the user who commented.
 * @param commentDateTime The date and time when the comment was posted.
 * @returns A Promise that resolves to the created Comment document.
 * @throws An error if any of the parameters are invalid.
 */
async function commentCreate(
  text: string,
  commentBy: string,
  commentDateTime: Date,
): Promise<Comment> {
  if (text === '' || commentBy === '' || commentDateTime == null)
    throw new Error('Invalid Comment Format');
  const commentDetail: Comment = {
    text: text,
    commentBy: commentBy,
    commentDateTime: commentDateTime,
  };
  return await CommentModel.create(commentDetail);
}

/**
 * Creates a new Answer document in the database.
 *
 * @param text The content of the answer.
 * @param ansBy The username of the user who wrote the answer.
 * @param ansDateTime The date and time when the answer was created.
 * @param comments The comments that have been added to the answer.
 * @returns A Promise that resolves to the created Answer document.
 * @throws An error if any of the parameters are invalid.
 */
async function answerCreate(
  text: string,
  ansBy: string,
  ansDateTime: Date,
  comments: Comment[],
  question: Question,
): Promise<Answer> {
  if (text === '' || ansBy === '' || ansDateTime == null || comments == null)
    throw new Error('Invalid Answer Format');
  const answerDetail: Answer = {
    text: text,
    ansBy: ansBy,
    ansDateTime: ansDateTime,
    comments: comments,
    question: question,
    upVotes: [],
    downVotes: [],
  };
  return await AnswerModel.create(answerDetail);
}

/**
 * Creates a new Question document in the database.
 *
 * @param title The title of the question.
 * @param text The content of the question.
 * @param tags An array of tags associated with the question.
 * @param answers An array of answers associated with the question.
 * @param askedBy The username of the user who asked the question.
 * @param askDateTime The date and time when the question was asked.
 * @param views An array of usernames who have viewed the question.
 * @param comments An array of comments associated with the question.
 * @returns A Promise that resolves to the created Question document.
 * @throws An error if any of the parameters are invalid.
 */
async function questionCreate(
  title: string,
  text: string,
  tags: Tag[],
  answers: Answer[],
  askedBy: string,
  askDateTime: Date,
  views: string[],
  comments: Comment[],
): Promise<Question> {
  if (
    title === '' ||
    text === '' ||
    tags.length === 0 ||
    askedBy === '' ||
    askDateTime == null ||
    comments == null
  )
    throw new Error('Invalid Question Format');
  const questionDetail: Question = {
    title: title,
    text: text,
    tags: tags,
    askedBy: askedBy,
    answers: answers,
    views: views,
    askDateTime: askDateTime,
    upVotes: [],
    downVotes: [],
    comments: comments,
  };
  return await QuestionModel.create(questionDetail);
}

/**
 * Creates a new Profile document in the database.
 */

async function profileCreate(
  username: string,
  joinedWhen?: Date,
  title?: string,
  bio?: string,
  answersGiven?: Answer[],
  questionsAsked?: Question[],
  questionsUpvoted?: Question[],
  answersUpvoted?: Answer[],
  following?: Types.ObjectId[]
): Promise<Profile> {
  if (username === '' || joinedWhen == null)
    throw new Error('Invalid Profile Format');

  // First, create all the profiles that this profile will follow
  // We'll collect their ObjectIds
  const followingIds = following 
    ? await Promise.all(
        following.map(async (username) => {
          const followedProfile = await ProfileModel.findOne({ username });
          if (!followedProfile) {
            throw new Error(`Profile with username ${username} not found`);
          }
          return followedProfile._id;
        })
      )
    : [];

  const profileDetail: Profile = {
    username: username,
    title: title || '', // Default to empty string if not provided
    bio: bio || '', // Default to empty string if not provided
    answersGiven: answersGiven || [], // Default to empty array
    questionsAsked: questionsAsked || [], // Default to empty array
    questionsUpvoted: questionsUpvoted || [], // Default to empty array
    answersUpvoted: answersUpvoted || [], // Default to empty array
    joinedWhen: joinedWhen || new Date(), // Default to current date
    following: followingIds, // Default to empty array
  };

  return await ProfileModel.create(profileDetail);
} 



/**
 * Populates the database with predefined data.
 * Logs the status of the operation to the console.
 */
const populate = async () => {
  try {
    const t1 = await tagCreate(T1_NAME, T1_DESC);
    const t2 = await tagCreate(T2_NAME, T2_DESC);
    const t3 = await tagCreate(T3_NAME, T3_DESC);
    const t4 = await tagCreate(T4_NAME, T4_DESC);
    const t5 = await tagCreate(T5_NAME, T5_DESC);
    const t6 = await tagCreate(T6_NAME, T6_DESC);
    const t7 = await tagCreate(T7_NAME, T7_DESC);
    const t8 = await tagCreate(T8_NAME, T8_DESC);
    const t9 = await tagCreate(T9_NAME, T9_DESC);

    const c1 = await commentCreate(C1_TEXT, 'sana', new Date('2023-12-12T03:30:00'));
    const c2 = await commentCreate(C2_TEXT, 'ihba001', new Date('2023-12-01T15:24:19'));
    const c3 = await commentCreate(C3_TEXT, 'saltyPeter', new Date('2023-12-18T09:24:00'));
    const c4 = await commentCreate(C4_TEXT, 'monkeyABC', new Date('2023-12-20T03:24:42'));
    const c5 = await commentCreate(C5_TEXT, 'hamkalo', new Date('2023-12-23T08:24:00'));
    const c6 = await commentCreate(C6_TEXT, 'azad', new Date('2023-12-22T17:19:00'));
    const c7 = await commentCreate(C7_TEXT, 'hamkalo', new Date('2023-12-22T21:17:53'));
    const c8 = await commentCreate(C8_TEXT, 'alia', new Date('2023-12-19T18:20:59'));
    const c9 = await commentCreate(C9_TEXT, 'ihba001', new Date('2022-02-20T03:00:00'));
    const c10 = await commentCreate(C10_TEXT, 'abhi3241', new Date('2023-02-10T11:24:30'));
    const c11 = await commentCreate(C11_TEXT, 'Joji John', new Date('2023-03-18T01:02:15'));
    const c12 = await commentCreate(C12_TEXT, 'abaya', new Date('2023-04-10T14:28:01'));
    const c13 = await commentCreate(C13_TEXT, 'techExpert', new Date('2023-12-25T10:15:00'));
    const c14 = await commentCreate(C14_TEXT, 'dataWizard', new Date('2023-12-26T14:20:00'));
    const c15 = await commentCreate(C15_TEXT, 'dockerPro', new Date('2023-12-27T16:45:00'));
    const c16 = await commentCreate(C16_TEXT, 'reactDev', new Date('2023-12-28T09:30:00'));


    // Create questions first to associate them with answers
    const q1 = await questionCreate(
      Q1_DESC,
      Q1_TXT,
      [t1, t2],
      [],
      'Joji John',
      new Date('2022-01-20T03:00:00'),
      ['sana', 'abaya', 'alia'],
      [c9],
    );
    const q2 = await questionCreate(
      Q2_DESC,
      Q2_TXT,
      [t3, t4, t2],
      [],
      'saltyPeter',
      new Date('2023-01-10T11:24:30'),
      ['mackson3332'],
      [c10],
    );
    const q3 = await questionCreate(
      Q3_DESC,
      Q3_TXT,
      [t5, t6],
      [],
      'monkeyABC',
      new Date('2023-02-18T01:02:15'),
      ['monkeyABC', 'elephantCDE'],
      [c11],
    );
    const q4 = await questionCreate(
      Q4_DESC,
      Q4_TXT,
      [t3, t4, t5],
      [],
      'elephantCDE',
      new Date('2023-03-10T14:28:01'),
      [],
      [c12],
    );

    const q5 = await questionCreate(
      Q5_DESC,
      Q5_TXT,
      [t7, t2],
      [],
      'techExpert',
      new Date('2023-12-15T08:00:00'),
      ['dockerPro', 'securityGuru'],
      [c13]
    );
    
    const q6 = await questionCreate(
      Q6_DESC,
      Q6_TXT,
      [t8],
      [],
      'dataWizard',
      new Date('2023-12-16T11:30:00'),
      ['pythonMaster', 'dataSage'],
      [c14]
    );
    
    const q7 = await questionCreate(
      Q7_DESC,
      Q7_TXT,
      [t9],
      [],
      'dockerPro',
      new Date('2023-12-17T14:45:00'),
      ['techExpert', 'cloudArchitect'],
      [c15]
    );
    
    const q8 = await questionCreate(
      Q8_DESC,
      Q8_TXT,
      [t1, t2],
      [],
      'reactDev',
      new Date('2023-12-18T16:20:00'),
      ['frontendGuru', 'webDev'],
      [c16]
    );
    

    // Create answers associated with specific questions
    const a1 = await answerCreate(A1_TXT, 'hamkalo', new Date('2023-11-20T03:24:42'), [c1], q1);
    const a2 = await answerCreate(A2_TXT, 'azad', new Date('2023-11-23T08:24:00'), [c2], q1);
    const a3 = await answerCreate(A3_TXT, 'abaya', new Date('2023-11-18T09:24:00'), [c3], q2);
    const a4 = await answerCreate(A4_TXT, 'alia', new Date('2023-11-12T03:30:00'), [c4], q2);
    const a5 = await answerCreate(A5_TXT, 'sana', new Date('2023-11-01T15:24:19'), [c5], q2);
    const a6 = await answerCreate(A6_TXT, 'abhi3241', new Date('2023-02-19T18:20:59'), [c6], q3);
    const a7 = await answerCreate(A7_TXT, 'mackson3332', new Date('2023-02-22T17:19:00'), [c7], q3);
    const a8 = await answerCreate(A8_TXT, 'ihba001', new Date('2023-03-22T21:17:53'), [c8], q4);
    const a9 = await answerCreate(A9_TXT, 'securityGuru', new Date('2023-12-25T09:00:00'), [c13], q5);
    const a10 = await answerCreate(A10_TXT, 'dataSage', new Date('2023-12-26T13:15:00'), [c14], q6);
    const a11 = await answerCreate(A11_TXT, 'cloudArchitect', new Date('2023-12-27T15:30:00'), [c15], q7);
    const a12 = await answerCreate(A12_TXT, 'frontendGuru', new Date('2023-12-28T10:45:00'), [c16], q8);
    

    // Update questions with their answers
    await QuestionModel.findByIdAndUpdate(q1._id, { answers: [a1, a2] });
    await QuestionModel.findByIdAndUpdate(q2._id, { answers: [a3, a4, a5] });
    await QuestionModel.findByIdAndUpdate(q3._id, { answers: [a6, a7] });
    await QuestionModel.findByIdAndUpdate(q4._id, { answers: [a8] });
    await QuestionModel.findByIdAndUpdate(q5._id, { answers: [a9] });
    await QuestionModel.findByIdAndUpdate(q6._id, { answers: [a10] });
    await QuestionModel.findByIdAndUpdate(q7._id, { answers: [a11] });
    await QuestionModel.findByIdAndUpdate(q8._id, { answers: [a12] });

    // Profiles creation logic (unchanged from your provided script)
    // Each profile will have their `answersGiven` properly associated with their corresponding questions
    const profile1 = await profileCreate('sana', new Date('2023-01-01'), P1_TITLE, P1_BIO, [a5], [], [], [], []);
    const profile2 = await profileCreate('ihba001', new Date('2023-02-01'), P2_TITLE, P2_BIO, [a8], [], [], [], []);
    const profile3 = await profileCreate('saltyPeter', new Date('2023-03-01'), P3_TITLE, P3_BIO, [], [q2], [], [], []);
    const profile4 = await profileCreate('monkeyABC', new Date('2023-04-01'), P4_TITLE, P4_BIO, [], [q3], [], [], []);
    const profile5 = await profileCreate('hamkalo', new Date('2023-05-01'), P5_TITLE, P5_BIO, [a1], [], [], [], []);
    const profile6 = await profileCreate('azad', new Date('2023-06-01'), P6_TITLE, P6_BIO, [a2], [], [], [], []);
    const profile7 = await profileCreate('alia', new Date('2023-07-01'), P7_TITLE, P7_BIO, [a4], [], [], [], []);
    const profile8 = await profileCreate('abhi3241', new Date('2023-08-01'), P8_TITLE, P8_BIO, [a6], [], [], [], []);
    const profile9 = await profileCreate('Joji John', new Date('2023-09-01'), P9_TITLE, P9_BIO, [], [q1], [], [], []);
    const profile10 = await profileCreate('abaya', new Date('2023-10-01'), P10_TITLE, P10_BIO, [a3], [], [], [], []);
    const profile11 = await profileCreate('mackson3332', new Date('2023-11-01'), P11_TITLE, P11_BIO, [a7], [], [], [], []);
    const profile12 = await profileCreate('elephantCDE', new Date('2023-09-11'), P12_TITLE, P12_BIO, [], [q4], [], [], []);
    const profile13 = await profileCreate(
      'techExpert',
      new Date('2023-12-01'),
      P13_TITLE,
      P13_BIO,
      [],
      [q5],
      [],
      [],
      []
    );
    
    const profile14 = await profileCreate(
      'dataWizard',
      new Date('2023-12-02'),
      P14_TITLE,
      P14_BIO,
      [],
      [q6],
      [],
      [],
      []
    );
    
    const profile15 = await profileCreate(
      'securityGuru',
      new Date('2023-12-03'),
      P15_TITLE,
      P15_BIO,
      [a9],
      [],
      [],
      [],
      []
    );
    
    const profile16 = await profileCreate(
      'frontendGuru',
      new Date('2023-12-04'),
      P16_TITLE,
      P16_BIO,
      [a12],
      [],
      [],
      [],
      []
    );


    // Update following relationships after all profiles are created
    await ProfileModel.findOneAndUpdate(
      { username: 'sana' },
      { following: await getProfileIds(['ihba001', 'alia']) }
    );

    await ProfileModel.findOneAndUpdate(
      { username: 'ihba001' },
      { following: await getProfileIds(['sana', 'Joji John']) }
    );

    await ProfileModel.findOneAndUpdate(
      { username: 'techExpert' },
      { following: await getProfileIds(['securityGuru', 'cloudArchitect']) }
    );
    
    await ProfileModel.findOneAndUpdate(
      { username: 'dataWizard' },
      { following: await getProfileIds(['dataSage', 'pythonMaster']) }
    );


    // Helper function to get profile IDs from usernames
    async function getProfileIds(usernames: string[]): Promise<Types.ObjectId[]> {
      const profiles = await ProfileModel.find({ username: { $in: usernames } });
      return profiles.map(profile => profile._id);
    }

    
    console.log('Database populated');
  } catch (err) {
    console.log('ERROR: ' + err);
  } finally {
    if (db) db.close();
    console.log('done');
  }
};

populate();

console.log('Processing ...');
