import { ObjectId } from 'mongodb';
import { QueryOptions } from 'mongoose';
import {
  Answer,
  AnswerResponse,
  BadgeCount,
  Comment,
  CommentResponse,
  OrderType,
  Profile,
  ProfileResponse,
  Question,
  QuestionResponse,
  Tag,
  TagScore,
} from '../types';
import AnswerModel from './answers';
import QuestionModel from './questions';
import TagModel from './tags';
import CommentModel from './comments';
import ProfileModel from './profile';

/**
 * Parses tags from a search string.
 *
 * @param {string} search - Search string containing tags in square brackets (e.g., "[tag1][tag2]")
 *
 * @returns {string[]} - An array of tags found in the search string
 */
const parseTags = (search: string): string[] =>
  (search.match(/\[([^\]]+)\]/g) || []).map(word => word.slice(1, -1));

/**
 * Parses keywords from a search string by removing tags and extracting individual words.
 *
 * @param {string} search - The search string containing keywords and possibly tags
 *
 * @returns {string[]} - An array of keywords found in the search string
 */
const parseKeyword = (search: string): string[] =>
  search.replace(/\[([^\]]+)\]/g, ' ').match(/\b\w+\b/g) || [];

/**
 * Checks if given question contains any tags from the given list.
 *
 * @param {Question} q - The question to check
 * @param {string[]} taglist - The list of tags to check for
 *
 * @returns {boolean} - `true` if any tag is present in the question, `false` otherwise
 */
const checkTagInQuestion = (q: Question, taglist: string[]): boolean => {
  for (const tagname of taglist) {
    for (const tag of q.tags) {
      if (tagname === tag.name) {
        return true;
      }
    }
  }

  return false;
};

/**
 * Checks if any keywords in the provided list exist in a given question's title or text.
 *
 * @param {Question} q - The question to check
 * @param {string[]} keywordlist - The list of keywords to check for
 *
 * @returns {boolean} - `true` if any keyword is present, `false` otherwise.
 */
const checkKeywordInQuestion = (q: Question, keywordlist: string[]): boolean => {
  for (const w of keywordlist) {
    if (q.title.includes(w) || q.text.includes(w)) {
      return true;
    }
  }

  return false;
};

/**
 * Gets the newest questions from a list, sorted by the asking date in descending order.
 *
 * @param {Question[]} qlist - The list of questions to sort
 *
 * @returns {Question[]} - The sorted list of questions
 */
const sortQuestionsByNewest = (qlist: Question[]): Question[] =>
  qlist.sort((a, b) => {
    if (a.askDateTime > b.askDateTime) {
      return -1;
    }

    if (a.askDateTime < b.askDateTime) {
      return 1;
    }

    return 0;
  });

/**
 * Gets unanswered questions from a list, sorted by the asking date in descending order.
 *
 * @param {Question[]} qlist - The list of questions to filter and sort
 *
 * @returns {Question[]} - The filtered and sorted list of unanswered questions
 */
const sortQuestionsByUnanswered = (qlist: Question[]): Question[] =>
  sortQuestionsByNewest(qlist).filter(q => q.answers.length === 0);

/**
 * Records the most recent answer time for a question.
 *
 * @param {Question} question - The question to check
 * @param {Map<string, Date>} mp - A map of the most recent answer time for each question
 */
const getMostRecentAnswerTime = (question: Question, mp: Map<string, Date>): void => {
  // This is a private function and we can assume that the answers field is not undefined or an array of ObjectId
  const answers = question.answers as Answer[];
  answers.forEach((answer: Answer) => {
    if (question._id !== undefined) {
      const currentMostRecent = mp.get(question?._id.toString());
      if (!currentMostRecent || currentMostRecent < answer.ansDateTime) {
        mp.set(question._id.toString(), answer.ansDateTime);
      }
    }
  });
};

/**
 * Gets active questions from a list, sorted by the most recent answer date in descending order.
 *
 * @param {Question[]} qlist - The list of questions to filter and sort
 *
 * @returns {Question[]} - The filtered and sorted list of active questions
 */
const sortQuestionsByActive = (qlist: Question[]): Question[] => {
  const mp = new Map();
  qlist.forEach(q => {
    getMostRecentAnswerTime(q, mp);
  });

  return sortQuestionsByNewest(qlist).sort((a, b) => {
    const adate = mp.get(a._id?.toString());
    const bdate = mp.get(b._id?.toString());
    if (!adate) {
      return 1;
    }
    if (!bdate) {
      return -1;
    }
    if (adate > bdate) {
      return -1;
    }
    if (adate < bdate) {
      return 1;
    }
    return 0;
  });
};

/**
 * Sorts a list of questions by the number of views in descending order. First, the questions are
 * sorted by creation date (newest first), then by number of views, from highest to lowest.
 * If questions have the same number of views, the newer question will be before the older question.
 *
 * @param qlist The array of Question objects to be sorted.
 *
 * @returns A new array of Question objects sorted by the number of views.
 */
const sortQuestionsByMostViews = (qlist: Question[]): Question[] =>
  sortQuestionsByNewest(qlist).sort((a, b) => b.views.length - a.views.length);

/**
 * Adds a tag to the database if it does not already exist.
 *
 * @param {Tag} tag - The tag to add
 *
 * @returns {Promise<Tag | null>} - The added or existing tag, or `null` if an error occurred
 */
export const addTag = async (tag: Tag): Promise<Tag | null> => {
  try {
    // Check if a tag with the given name already exists
    const existingTag = await TagModel.findOne({ name: tag.name });

    if (existingTag) {
      return existingTag as Tag;
    }

    // If the tag does not exist, create a new one
    const newTag = new TagModel(tag);
    const savedTag = await newTag.save();

    return savedTag as Tag;
  } catch (error) {
    return null;
  }
};

/**
 * Retrieves questions from the database, ordered by the specified criteria.
 *
 * @param {OrderType} order - The order type to filter the questions
 *
 * @returns {Promise<Question[]>} - Promise that resolves to a list of ordered questions
 */
export const getQuestionsByOrder = async (order: OrderType): Promise<Question[]> => {
  try {
    let qlist = [];
    if (order === 'active') {
      qlist = await QuestionModel.find().populate([
        { path: 'tags', model: TagModel },
        { path: 'answers', model: AnswerModel },
      ]);
      return sortQuestionsByActive(qlist);
    }
    qlist = await QuestionModel.find().populate([{ path: 'tags', model: TagModel }]);
    if (order === 'unanswered') {
      return sortQuestionsByUnanswered(qlist);
    }
    if (order === 'newest') {
      return sortQuestionsByNewest(qlist);
    }
    return sortQuestionsByMostViews(qlist);
  } catch (error) {
    return [];
  }
};

/**
 * Filters a list of questions by the user who asked them.
 *
 * @param qlist The array of Question objects to be filtered.
 * @param askedBy The username of the user who asked the questions.
 *
 * @returns Filtered Question objects.
 */
export const filterQuestionsByAskedBy = (qlist: Question[], askedBy: string): Question[] =>
  qlist.filter(q => q.askedBy === askedBy);

/**
 * Filters questions based on a search string containing tags and/or keywords.
 *
 * @param {Question[]} qlist - The list of questions to filter
 * @param {string} search - The search string containing tags and/or keywords
 *
 * @returns {Question[]} - The filtered list of questions matching the search criteria
 */
export const filterQuestionsBySearch = (qlist: Question[], search: string): Question[] => {
  const searchTags = parseTags(search);
  const searchKeyword = parseKeyword(search);

  if (!qlist || qlist.length === 0) {
    return [];
  }
  return qlist.filter((q: Question) => {
    if (searchKeyword.length === 0 && searchTags.length === 0) {
      return true;
    }

    if (searchKeyword.length === 0) {
      return checkTagInQuestion(q, searchTags);
    }

    if (searchTags.length === 0) {
      return checkKeywordInQuestion(q, searchKeyword);
    }

    return checkKeywordInQuestion(q, searchKeyword) || checkTagInQuestion(q, searchTags);
  });
};

/**
 * Fetches and populates a profile based on the provided username.
 *
 * @param id - The id of the profile to fetch.
 *
 * @returns {Promise<ProfileResponse>} - Promise that resolves to the
 *          populated profile, or an error message if the operation fails
 */
export const populateProfile = async (id: string | undefined): Promise<ProfileResponse> => {
  try {
    if (!id) {
      throw new Error('Provided question ID is undefined.');
    }

    let result = null;
    result = await ProfileModel.findOne({ _id: id }).populate([
      {
        path: 'answersGiven',
        model: AnswerModel,
      },
      {
        path: 'questionsAsked',
        model: QuestionModel,
      },
      {
        path: 'questionsUpvoted',
        model: QuestionModel,
      },
      {
        path: 'answersUpvoted',
        model: AnswerModel,
      },
    ]);
    if (!result) {
      throw new Error(`Failed to fetch and populate profile`);
    }
    return result;
  } catch (error) {
    return { error: `Error when fetching and populating a document: ${(error as Error).message}` };
  }
};

/**
 * Fetches and populates a question or answer document based on the provided ID and type.
 *
 * @param {string | undefined} id - The ID of the question or answer to fetch.
 * @param {'question' | 'answer'} type - Specifies whether to fetch a question or an answer.
 *
 * @returns {Promise<QuesxtionResponse | AnswerResponse>} - Promise that resolves to the
 *          populated question or answer, or an error message if the operation fails
 */
export const populateDocument = async (
  id: string | undefined,
  type: 'question' | 'answer',
): Promise<QuestionResponse | AnswerResponse> => {
  try {
    if (!id) {
      throw new Error('Provided question ID is undefined.');
    }

    let result = null;

    if (type === 'question') {
      result = await QuestionModel.findOne({ _id: id }).populate([
        {
          path: 'tags',
          model: TagModel,
        },
        {
          path: 'answers',
          model: AnswerModel,
          populate: [
            { path: 'comments', model: CommentModel }, // Populate comments of answers
            { path: 'question', model: QuestionModel, select: '_id title askDateTime' }, // Populate associated question (likely redundant here)
          ],
        },
        { path: 'comments', model: CommentModel },
      ]);
    } else if (type === 'answer') {
      result = await AnswerModel.findOne({ _id: id }).populate([
        { path: 'comments', model: CommentModel },
        { path: 'question', model: QuestionModel, select: '_id title askDateTime' }, // Populate associated question with the id and title of the question.
      ]);
    }
    if (!result) {
      throw new Error(`Failed to fetch and populate a ${type}`);
    }
    return result;
  } catch (error) {
    return { error: `Error when fetching and populating a document: ${(error as Error).message}` };
  }
};

/**
 * Fetches a question by its ID and increments its view count.
 *
 * @param {string} qid - The ID of the question to fetch.
 * @param {string} username - The username of the user requesting the question.
 *
 * @returns {Promise<QuestionResponse | null>} - Promise that resolves to the fetched question
 *          with incremented views, null if the question is not found, or an error message.
 */
export const fetchAndIncrementQuestionViewsById = async (
  qid: string,
  username: string,
): Promise<QuestionResponse | null> => {
  try {
    const q = await QuestionModel.findOneAndUpdate(
      { _id: new ObjectId(qid) },
      { $addToSet: { views: username } }, // Add username to the views array (no duplicates)
      { new: true }, // Return the updated document
    ).populate([
      {
        path: 'tags',
        model: TagModel,
      },
      {
        path: 'answers',
        model: AnswerModel,
        populate: [
          { path: 'comments', model: CommentModel }, // Populate comments on the answer
          { path: 'question', model: QuestionModel, select: '_id title askDateTime' }, // Populate associated question
        ],
      },
      { path: 'comments', model: CommentModel }, // Populate comments on the question
    ]);

    return q;
  } catch (error) {
    return { error: 'Error when fetching and updating a question' };
  }
};

/**
 * Saves a new question to the database.
 *
 * @param {Question} question - The question to save
 *
 * @returns {Promise<QuestionResponse>} - The saved question, or error message
 */
export const saveQuestion = async (question: Question): Promise<QuestionResponse> => {
  try {
    const result = await QuestionModel.create(question);
    return result;
  } catch (error) {
    return { error: 'Error when saving a question' };
  }
};

/**
 * Saves a new answer to the database.
 *
 * @param {Answer} answer - The answer to save
 * @param {string} questionId - The ID of the associated question
 *
 * @returns {Promise<AnswerResponse>} - The saved answer, or an error message if the save failed
 */
export const saveAnswer = async (answer: Answer, questionId: string): Promise<AnswerResponse> => {
  try {
    // Validate the answer object
    if (!answer || !answer.text || !answer.ansBy || !answer.ansDateTime) {
      throw new Error('Invalid answer');
    }

    // Ensure the question field is set
    const answerToSave = {
      ...answer,
      question: new ObjectId(questionId),
    };

    // Save the answer to the database
    const result = await AnswerModel.create(answerToSave);

    return result;
  } catch (error) {
    return { error: `Error when saving an answer: ${(error as Error).message}` };
  }
};

/**
 * Saves a new comment to the database.
 *
 * @param {Comment} comment - The comment to save
 *
 * @returns {Promise<CommentResponse>} - The saved comment, or an error message if the save failed
 */
export const saveComment = async (comment: Comment): Promise<CommentResponse> => {
  try {
    const result = await CommentModel.create(comment);
    return result;
  } catch (error) {
    return { error: 'Error when saving a comment' };
  }
};

/**
 * Saves a new profile to the database.
 *
 * @param {Profile} profile - The profile to save
 * @returns {Promise<ProfileResponse>} - The saved profile, or error message
 */
export const saveProfile = async (profile: Profile): Promise<ProfileResponse> => {
  try {
    const result = await ProfileModel.create(profile);
    return result;
  } catch (error) {
    return { error: 'Error when saving a profile' };
  }
};

/**
 * Processes a list of tags by removing duplicates, checking for existing tags in the database,
 * and adding non-existing tags. Returns an array of the existing or newly added tags.
 * If an error occurs during the process, it is logged, and an empty array is returned.
 *
 * @param tags The array of Tag objects to be processed.
 *
 * @returns A Promise that resolves to an array of Tag objects.
 */
export const processTags = async (tags: Tag[]): Promise<Tag[]> => {
  try {
    // Extract unique tag names from the provided tags array using a Set to eliminate duplicates
    const uniqueTagNamesSet = new Set(tags.map(tag => tag.name));

    // Create an array of unique Tag objects by matching tag names
    const uniqueTags = [...uniqueTagNamesSet].map(
      name => tags.find(tag => tag.name === name)!, // The '!' ensures the Tag is found, assuming no undefined values
    );

    // Use Promise.all to asynchronously process each unique tag.
    const processedTags = await Promise.all(
      uniqueTags.map(async tag => {
        const existingTag = await TagModel.findOne({ name: tag.name });

        if (existingTag) {
          return existingTag; // If tag exists, return it as part of the processed tags
        }

        const addedTag = await addTag(tag);
        if (addedTag) {
          return addedTag; // If the tag does not exist, attempt to add it to the database
        }

        // Throwing an error if addTag fails
        throw new Error(`Error while adding tag: ${tag.name}`);
      }),
    );

    return processedTags;
  } catch (error: unknown) {
    // Log the error for debugging purposes
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    // eslint-disable-next-line no-console
    console.log('An error occurred while adding tags:', errorMessage);
    return [];
  }
};

/**
 * Adds a vote to a document.
 *
 * @param docID The ID of the document to add a vote to.
 * @param username The username of the user who voted.
 * @param voteType The type of vote to add, either 'upvote' or 'downvote'.
 * @param docType The type of document to add the vote to, either 'question' or 'answer'.
 *
 * @returns A Promise that resolves to an object containing either a success message or an error message,
 *          along with the updated upVotes and downVotes arrays.
 */
export const addVoteToDocument = async (
  docID: string,
  username: string,
  voteType: 'upvote' | 'downvote',
  docType: 'question' | 'answer',
): Promise<{ msg: string; upVotes: string[]; downVotes: string[] } | { error: string }> => {
  let updateOperation: QueryOptions;
  let updateProfileOperation: QueryOptions;
  let fieldName = '';
  if (docType === 'question') {
    fieldName = 'questionsAsked';
  } else if (docType === 'answer') {
    fieldName = 'answersGiven';
  } else {
    throw new Error('docType must be one of: question, answer, profile');
  }

  if (voteType === 'upvote') {
    updateOperation = [
      {
        $set: {
          upVotes: {
            $cond: [
              { $in: [username, '$upVotes'] },
              { $filter: { input: '$upVotes', as: 'u', cond: { $ne: ['$$u', username] } } },
              { $concatArrays: ['$upVotes', [username]] },
            ],
          },
          downVotes: {
            $cond: [
              { $in: [username, '$upVotes'] },
              '$downVotes',
              { $filter: { input: '$downVotes', as: 'd', cond: { $ne: ['$$d', username] } } },
            ],
          },
        },
      },
    ];
    updateProfileOperation = [
      {
        $set: {
          questionsUpvoted: {
            $cond: [
              { $in: [docID, { $getField: fieldName }] },
              {
                $filter: {
                  input: { $getField: fieldName },
                  as: 'q',
                  cond: { $ne: ['$$q', docID] },
                },
              },
              { $concatArrays: [{ $getField: fieldName }, [docID]] },
            ],
          },
        },
      },
    ];
  } else {
    updateOperation = [
      {
        $set: {
          downVotes: {
            $cond: [
              { $in: [username, '$downVotes'] },
              { $filter: { input: '$downVotes', as: 'd', cond: { $ne: ['$$d', username] } } },
              { $concatArrays: ['$downVotes', [username]] },
            ],
          },
          upVotes: {
            $cond: [
              { $in: [username, '$downVotes'] },
              '$upVotes',
              { $filter: { input: '$upVotes', as: 'u', cond: { $ne: ['$$u', username] } } },
            ],
          },
        },
      },
    ];
    updateProfileOperation = { $pull: { [fieldName]: docID } };
  }

  try {
    let resultDoc;
    if (docType === 'question') {
      resultDoc = await QuestionModel.findOneAndUpdate({ _id: docID }, updateOperation, {
        new: true,
      });
    } else {
      resultDoc = await AnswerModel.findOneAndUpdate({ _id: docID }, updateOperation, {
        new: true,
      });
    }

    if (!resultDoc || 'error' in resultDoc) {
      return { error: `${docType} not found!` };
    }

    resultDoc = docType === 'question' ? (resultDoc as Question) : (resultDoc as Answer);

    const resultProf = await ProfileModel.findOneAndUpdate({ username }, updateProfileOperation, {
      new: true,
    });
    if (!resultProf || 'error' in resultProf) {
      return { error: 'Error adding vote to profile' };
    }

    let msg = '';

    if (voteType === 'upvote') {
      msg = resultDoc.upVotes.includes(username)
        ? `${docType} upvoted successfully`
        : 'Upvote cancelled successfully';
    } else {
      msg = resultDoc.downVotes.includes(username)
        ? `${docType} downvoted successfully`
        : 'Downvote cancelled successfully';
    }

    if (!resultDoc._id) {
      throw new Error('Document ID error');
    }

    return {
      msg,
      upVotes: resultDoc.upVotes || [],
      downVotes: resultDoc.downVotes || [],
    };
  } catch (err) {
    return {
      error:
        voteType === 'upvote'
          ? `Error when adding upvote to ${docType}`
          : `Error when adding downvote to ${docType}`,
    };
  }
};

/**
 * Adds an answer to a question.
 *
 * @param {string} qid - The ID of the question to add an answer to
 * @param {Answer} ans - The answer to add
 *
 * @returns Promise<QuestionResponse> - The updated question or an error message
 */
// This isn't modified because we already added the qid to the answer in the saveAnswer function!
export const addAnswerToQuestion = async (qid: string, ans: Answer): Promise<QuestionResponse> => {
  try {
    if (!ans || !ans.text || !ans.ansBy || !ans.ansDateTime) {
      throw new Error('Invalid answer');
    }
    const result = await QuestionModel.findOneAndUpdate(
      { _id: qid },
      { $push: { answers: { $each: [ans._id], $position: 0 } } },
      { new: true },
    );
    if (result === null) {
      throw new Error('Error when adding answer to question');
    }
    return result;
  } catch (error) {
    return { error: 'Error when adding answer to question' };
  }
};

/**
 * Updates a profile based on username and updates provided.
 *
 * @param username - Username of the profile to update
 * @param value - The objectID of the item being added to the profile
 * @param field - The field from the profile schema that we are adding to
 * @returns The updated profile or an error message if the update failed
 */
export const updateProfileArray = async (
  username: string,
  value: ObjectId,
  field: string,
): Promise<ProfileResponse> => {
  if (!(field && value)) {
    return { error: 'Field and value are required' };
  }

  const validFields = ['answersGiven', 'questionsAsked', 'questionsUpvoted', 'answersUpvoted'];
  if (!validFields.includes(field)) {
    return { error: `Invalid field: ${field} Must be one of: ${validFields.join(', ')}` };
  }
  const updatedProfile = await ProfileModel.findOneAndUpdate(
    { username },
    { $push: { [field]: { $each: [value], $postion: 0 } } },
    { new: true },
  );
  if (updatedProfile === null) {
    return { error: 'Profile not found!' };
  }
  return updatedProfile;
};

/**
 * Adds a comment to a question or answer.
 *
 * @param id The ID of the question or answer to add a comment to
 * @param type The type of the comment, either 'question' or 'answer'
 * @param comment The comment to add
 *
 * @returns A Promise that resolves to the updated question or answer, or an error message if the operation fails
 */
export const addComment = async (
  id: string,
  type: 'question' | 'answer',
  comment: Comment,
): Promise<QuestionResponse | AnswerResponse> => {
  try {
    if (!comment || !comment.text || !comment.commentBy || !comment.commentDateTime) {
      throw new Error('Invalid comment');
    }
    let result: QuestionResponse | AnswerResponse | null;
    if (type === 'question') {
      result = await QuestionModel.findOneAndUpdate(
        { _id: id },
        { $push: { comments: { $each: [comment._id] } } },
        { new: true },
      );
    } else {
      result = await AnswerModel.findOneAndUpdate(
        { _id: id },
        { $push: { comments: { $each: [comment._id] } } },
        { new: true },
      );
    }
    if (result === null) {
      throw new Error('Failed to add comment');
    }
    return result;
  } catch (error) {
    return { error: `Error when adding comment: ${(error as Error).message}` };
  }
};

/**
 * Gets a map of tags and their corresponding question counts.
 *
 * @returns {Promise<Map<string, number> | null | { error: string }>} - A map of tags to their
 *          counts, `null` if there are no tags in the database, or the error message.
 */
export const getTagCountMap = async (): Promise<Map<string, number> | null | { error: string }> => {
  try {
    const tlist = await TagModel.find();
    const qlist = await QuestionModel.find().populate({
      path: 'tags',
      model: TagModel,
    });

    if (!tlist || tlist.length === 0) {
      return null;
    }

    const tmap = new Map(tlist.map(t => [t.name, 0]));

    if (qlist != null && qlist !== undefined && qlist.length > 0) {
      qlist.forEach(q => {
        q.tags.forEach(t => {
          tmap.set(t.name, (tmap.get(t.name) || 0) + 1);
        });
      });
    }

    return tmap;
  } catch (error) {
    return { error: 'Error when construction tag map' };
  }
};

export const calculateTagScores = async (questions: Question[]): Promise<TagScore[]> => {
  // Create a map to store tag statistics
  const tagStats = new Map<
    string,
    {
      posts: number;
      points: number;
    }
  >();

  // Process each question
  questions.forEach(question => {
    // Calculate points for this question
    const questionPoints = question.upVotes.length - question.downVotes.length;

    // Process each tag in the question
    question.tags.forEach(tag => {
      const currentStats = tagStats.get(tag.name) || { posts: 0, points: 0 };

      // Update statistics
      tagStats.set(tag.name, {
        posts: currentStats.posts + 1,
        points: currentStats.points + questionPoints,
      });
    });
  });

  // Convert map to array and calculate scores
  const tagScores: TagScore[] = Array.from(tagStats.entries()).map(([name, stats]) => {
    // Score formula: posts * 0.7 + points * 0.3 * 5
    const score = Math.round((stats.posts * 0.7 + stats.points * 0.3) * 5);

    return {
      name,
      score,
      posts: stats.posts,
      points: stats.points,
    };
  });

  // Sort tags by score in descending order and return top 3 directly
  return tagScores.sort((a, b) => b.score - a.score).slice(0, 3);
};
// export const calculateTagScores = async (questions: Question[]): Promise<TagScore[]> => {

export const calculateBadges = async (
  questions: Question[],
  answers: Answer[],
): Promise<BadgeCount> => {
  const badges: BadgeCount = {
    gold: 0,
    silver: 0,
    bronze: 0,
  };
  // Process questions
  questions.forEach(question => {
    const upvoteCount = question.upVotes.length;

    if (upvoteCount >= 7) {
      badges.gold++;
    } else if (upvoteCount >= 5) {
      badges.silver++;
    } else if (upvoteCount >= 3) {
      badges.bronze++;
    }
  });

  // Process answers
  answers.forEach(answer => {
    const upvoteCount = answer.upVotes.length;

    if (upvoteCount >= 7) {
      badges.gold++;
    } else if (upvoteCount >= 5) {
      badges.silver++;
    } else if (upvoteCount >= 3) {
      badges.bronze++;
    }
  });

  return badges;
};

export const calculateReputation = async (
  questions: Question[],
  answers: Answer[],
): Promise<number> => {
  let score = 0;
  // Process questions
  questions.forEach(question => {
    const upvoteCount = question.upVotes.length;
    const downvoteCount = question.downVotes.length;

    const questionScore = upvoteCount - downvoteCount;
    score += questionScore;
  });

  // Process answers
  answers.forEach(answer => {
    const upvoteCount = answer.upVotes.length;
    const downvoteCount = answer.downVotes.length;

    const questionScore = upvoteCount - downvoteCount;
    score += questionScore;
  });
  return score;
};
