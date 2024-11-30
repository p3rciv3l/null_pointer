import express, { Response } from 'express';
import { ObjectId } from 'mongodb';
import {
  Question,
  FindQuestionRequest,
  FindQuestionByIdRequest,
  AddQuestionRequest,
  VoteRequest,
  FakeSOSocket,
} from '../types';
import {
  addVoteToQuestion,
  fetchAndIncrementQuestionViewsById,
  filterQuestionsByAskedBy,
  filterQuestionsBySearch,
  getQuestionsByOrder,
  processTags,
  populateDocument,
  saveQuestion,
} from '../models/application';
import Notification from '../models/notification';

const questionController = (socket: FakeSOSocket) => {
  const router = express.Router();

  const getQuestionsByFilter = async (req: FindQuestionRequest, res: Response): Promise<void> => {
    const { order } = req.query;
    const { search } = req.query;
    const { askedBy } = req.query;
    try {
      let qlist: Question[] = await getQuestionsByOrder(order);
      if (askedBy) {
        qlist = filterQuestionsByAskedBy(qlist, askedBy);
      }
      const resqlist: Question[] = await filterQuestionsBySearch(qlist, search);
      res.json(resqlist);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when fetching questions by filter: ${err.message}`);
      } else {
        res.status(500).send(`Error when fetching questions by filter`);
      }
    }
  };

  const getQuestionById = async (req: FindQuestionByIdRequest, res: Response): Promise<void> => {
    const { qid } = req.params;
    const { username } = req.query;

    if (!ObjectId.isValid(qid)) {
      res.status(400).send('Invalid ID format');
      return;
    }

    if (username === undefined) {
      res.status(400).send('Invalid username requesting question.');
      return;
    }

    try {
      const q = await fetchAndIncrementQuestionViewsById(qid, username);

      if (q && !('error' in q)) {
        socket.emit('viewsUpdate', q);
        res.json(q);
        return;
      }

      throw new Error('Error while fetching question by id');
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when fetching question by id: ${err.message}`);
      } else {
        res.status(500).send(`Error when fetching question by id`);
      }
    }
  };

  /**
   * Validates the question object to ensure it contains all the necessary fields.
   *
   * @param question The question object to validate.
   *
   * @returns `true` if the question is valid, otherwise `false`.
   */
  const isQuestionBodyValid = (question: Question): boolean =>
    question.title !== undefined &&
    question.title !== '' &&
    question.text !== undefined &&
    question.text !== '' &&
    question.tags !== undefined &&
    question.tags.length > 0 &&
    question.askedBy !== undefined &&
    question.askedBy !== '' &&
    question.askDateTime !== undefined &&
    question.askDateTime !== null;

  const shouldNotifyAtUpvoteCount = (count: number): boolean => {
    const notificationThresholds = [1, 5, 20, 50, 100, 200, 500, 1000, 100000, 10000000];
    return count <= 10000000 && notificationThresholds.includes(count);
  };

  /**
   * Adds a new question to the database. The question is first validated and then saved.
   * If the tags are invalid or saving the question fails, the HTTP response status is updated.
   *
   * @param req The AddQuestionRequest object containing the question data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const addQuestion = async (req: AddQuestionRequest, res: Response): Promise<void> => {
    if (!isQuestionBodyValid(req.body)) {
      res.status(400).send('Invalid question body');
      return;
    }

    const question: Question = req.body;
    try {
      const questionswithtags: Question = {
        ...question,
        tags: await processTags(question.tags),
      };

      if (questionswithtags.tags.length === 0) {
        throw new Error('Invalid tags');
      }

      const result = await saveQuestion(questionswithtags);
      if ('error' in result) {
        throw new Error(result.error);
      }

      // Populates the fields of the question that was added, and emits the new object
      const populatedQuestion = await populateDocument(result._id?.toString(), 'question');

      if (populatedQuestion && 'error' in populatedQuestion) {
        throw new Error(populatedQuestion.error);
      }

      // emit question update
      socket.emit('questionUpdate', populatedQuestion as Question);

      // emit notification to question author
      const notification = new Notification({
        type: 'question',
        message: `Your question "${question.title}" has been posted successfully`,
        timestamp: new Date(),
        read: false,
        userId: question.askedBy,
        relatedId: result._id?.toString(),
      });

      await notification.save();

      socket.emit('notificationUpdate', {
        id: notification.id.toString(),
        type: notification.type as 'reply' | 'vote' | 'question',
        message: notification.message,
        timestamp: notification.timestamp,
        read: notification.read,
        userId: notification.userId,
        relatedId: notification.relatedId,
      });

      res.json(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when saving question: ${err.message}`);
      } else {
        res.status(500).send(`Error when saving question`);
      }
    }
  };

  const voteQuestion = async (
    req: VoteRequest,
    res: Response,
    type: 'upvote' | 'downvote',
  ): Promise<void> => {
    if (!req.body.qid || !req.body.username) {
      res.status(400).send('Invalid request');
      return;
    }

    const { qid, username } = req.body;

    try {
      const status = await addVoteToQuestion(qid, username, type);
      if ('error' in status) {
        throw new Error(status.error);
      }

      socket.emit('voteUpdate', {
        qid,
        upVotes: status.upVotes,
        downVotes: status.downVotes,
      });

      if (
        type === 'upvote' &&
        status.upVotes.length > 0 &&
        shouldNotifyAtUpvoteCount(status.upVotes.length)
      ) {
        const questionRes = await fetchAndIncrementQuestionViewsById(qid, username);
        if (questionRes && !('error' in questionRes)) {
          socket.emit('notificationUpdate', {
            id: new ObjectId().toString(),
            type: 'vote',
            message: `Congratulations! Your question "${questionRes.title}" has reached ${status.upVotes.length} upvote${status.upVotes.length === 1 ? '' : 's'}!`,
            timestamp: new Date(),
            read: false,
            userId: questionRes.askedBy,
            relatedId: qid,
          });
        }
      }

      res.json({
        msg: status.msg,
        upVotes: status.upVotes,
        downVotes: status.downVotes,
      });
    } catch (err) {
      if (err instanceof Error) {
        res.status(500).send(`Error when ${type}ing: ${err.message}`);
      } else {
        res.status(500).send(`Error when ${type}ing`);
      }
    }
  };

  const upvoteQuestion = async (req: VoteRequest, res: Response): Promise<void> => {
    voteQuestion(req, res, 'upvote');
  };

  const downvoteQuestion = async (req: VoteRequest, res: Response): Promise<void> => {
    voteQuestion(req, res, 'downvote');
  };

  router.get('/getQuestion', getQuestionsByFilter);
  router.get('/getQuestionById/:qid', getQuestionById);
  router.post('/addQuestion', addQuestion);
  router.post('/upvoteQuestion', upvoteQuestion);
  router.post('/downvoteQuestion', downvoteQuestion);

  return router;
};

export default questionController;
