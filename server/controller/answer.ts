import express, { Response } from 'express';
import { ObjectId } from 'mongodb';
import { Answer, AnswerRequest, AnswerResponse, FakeSOSocket, VoteRequest } from '../types';
import {
  addAnswerToQuestion,
  populateDocument,
  saveAnswer,
  fetchAndIncrementQuestionViewsById,
  updateProfileArray,
  addVoteToDocument,
} from '../models/application';

const answerController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Checks if the provided answer request contains the required fields.
   *
   * @param req The request object containing the answer data.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  function isRequestValid(req: AnswerRequest): boolean {
    return !!req.body.qid && !!req.body.ans;
  }

  /**
   * Checks if the provided answer contains the required fields.
   *
   * @param ans The answer object to validate.
   *
   * @returns `true` if the answer is valid, otherwise `false`.
   */
  function isAnswerValid(ans: Answer): boolean {
    return !!ans.text && !!ans.ansBy && !!ans.ansDateTime;
  }

  /**
   * Checks if the provided count is worthy of notification
   *
   * @param count The current upvote count.
   *
   * @returns `true` if we should notify.
   */
  const shouldNotifyAtUpvoteCount = (count: number): boolean => {
    const notificationThresholds = [1, 5, 20, 50, 100, 200, 500, 1000, 100000, 10000000];
    return count <= 10000000 && notificationThresholds.includes(count);
  };

  /**
   * Adds a new answer to a question in the database. The answer request and answer are
   * validated and then saved. If successful, the answer is associated with the corresponding
   * question. If there is an error, the HTTP response's status is updated.
   *
   * @param req The AnswerRequest object containing the question ID and answer data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const addAnswer = async (req: AnswerRequest, res: Response): Promise<void> => {
    if (!isRequestValid(req)) {
      res.status(400).send('Invalid request');
      return;
    }
    if (!isAnswerValid(req.body.ans)) {
      res.status(400).send('Invalid answer');
      return;
    }

    const { qid } = req.body;
    const ansInfo: Answer = req.body.ans;
    try {
      // Get the question first to get the author
      const questionRes = await fetchAndIncrementQuestionViewsById(qid, ansInfo.ansBy);
      if (!questionRes || 'error' in questionRes) {
        throw new Error('Question not found');
      }

      const ansFromDb = await saveAnswer(ansInfo, qid);
      if ('error' in ansFromDb) {
        throw new Error(ansFromDb.error as string);
      }

      const status = await addAnswerToQuestion(qid, ansFromDb);
      if (status && 'error' in status) {
        throw new Error(status.error as string);
      }

      const populatedAns = await populateDocument(ansFromDb._id?.toString(), 'answer');
      if ('error' in populatedAns) {
        throw new Error(populatedAns.error as string);
      }

      const forcedAns = populatedAns as Answer;
      if (forcedAns._id === undefined) {
        throw new Error('question ID error');
      }

      const profileStatus = await updateProfileArray(
        forcedAns.ansBy,
        forcedAns._id,
        'answersGiven',
      );

      if (!profileStatus || 'error' in profileStatus) {
        throw new Error('Error adding answer to profile');
      }

      // Emit answer update
      socket.emit('answerUpdate', {
        qid,
        answer: populatedAns as AnswerResponse,
      });

      // Emit notification to question author
      socket.emit('notificationUpdate', {
        id: new ObjectId().toString(),
        type: 'reply',
        message: `${ansInfo.ansBy} answered your question "${questionRes.title}"`,
        timestamp: new Date(),
        read: false,
        userId: questionRes.askedBy,
        relatedId: qid,
      });

      res.json(ansFromDb);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when adding answer: ${err.message}`);
      } else {
        res.status(500).send('Error when adding answer');
      }
    }
  };

  const voteAnswer = async (
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
      const status = await addVoteToDocument(qid, username, type, 'answer');
      if ('error' in status) {
        throw new Error(status.error);
      }

      socket.emit('voteUpdateAnswer', {
        qid,
        upVotes: status.upVotes,
        downVotes: status.downVotes,
      });

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

  const upvoteAnswer = async (req: VoteRequest, res: Response): Promise<void> => {
    voteAnswer(req, res, 'upvote');
  };

  const downvoteAnswer = async (req: VoteRequest, res: Response): Promise<void> => {
    voteAnswer(req, res, 'downvote');
  };

  // add appropriate HTTP verbs and their endpoints to the router.
  router.post('/addAnswer', addAnswer);
  router.post('/upvoteAnswer', upvoteAnswer);
  router.post('/downvoteAnswer', downvoteAnswer);

  return router;
};

export default answerController;
