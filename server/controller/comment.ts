import express, { Response } from 'express';
import { ObjectId } from 'mongodb';
import { Comment, AddCommentRequest, FakeSOSocket, Question, Answer } from '../types';
import { addComment, populateDocument, saveComment } from '../models/application';

const commentController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Checks if the provided answer request contains the required fields.
   *
   * @param req The request object containing the answer data.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  const isRequestValid = (req: AddCommentRequest): boolean =>
    !!req.body.id &&
    !!req.body.type &&
    (req.body.type === 'question' || req.body.type === 'answer') &&
    !!req.body.comment &&
    req.body.comment.text !== undefined &&
    req.body.comment.commentBy !== undefined &&
    req.body.comment.commentDateTime !== undefined;

  /**
   * Validates the comment object to ensure it is not empty.
   *
   * @param comment The comment to validate.
   *
   * @returns `true` if the coment is valid, otherwise `false`.
   */
  const isCommentValid = (comment: Comment): boolean =>
    comment.text !== undefined &&
    comment.text !== '' &&
    comment.commentBy !== undefined &&
    comment.commentBy !== '' &&
    comment.commentDateTime !== undefined &&
    comment.commentDateTime !== null;

  /**
   * Handles adding a new comment to the specified question or answer. The comment is first validated and then saved.
   * If the comment is invalid or saving fails, the HTTP response status is updated.
   *
   * @param req The AddCommentRequest object containing the comment data.
   * @param res The HTTP response object used to send back the result of the operation.
   * @param type The type of the comment, either 'question' or 'answer'.
   *
   * @returns A Promise that resolves to void.
   */
  const addCommentRoute = async (req: AddCommentRequest, res: Response): Promise<void> => {
    if (!isRequestValid(req)) {
      res.status(400).send('Invalid request');
      return;
    }

    const id = req.body.id as string;

    if (!ObjectId.isValid(id)) {
      res.status(400).send('Invalid ID format');
      return;
    }

    const { comment, type } = req.body;

    if (!isCommentValid(comment)) {
      res.status(400).send('Invalid comment body');
      return;
    }

    try {
      // Get the original document to find its author
      const originalDoc = await populateDocument(id, type);
      if (!originalDoc || 'error' in originalDoc) {
        throw new Error('Original document not found');
      }

      // type guard
      const isQuestion = (doc: Question | Answer): doc is Question =>
        'title' in doc && 'askedBy' in doc;
      const isAnswer = (doc: Question | Answer): doc is Answer =>
        'ansBy' in doc && 'question' in doc;

      if (!isQuestion(originalDoc) && !isAnswer(originalDoc)) {
        throw new Error('Invalid document type');
      }

      const comFromDb = await saveComment(comment);
      if ('error' in comFromDb) {
        throw new Error(comFromDb.error);
      }

      const status = await addComment(id, type, comFromDb);
      if (status && 'error' in status) {
        throw new Error(status.error);
      }

      const populatedDoc = await populateDocument(id, type);
      if (populatedDoc && 'error' in populatedDoc) {
        throw new Error(populatedDoc.error);
      }

      socket.emit('commentUpdate', {
        result: populatedDoc,
        type,
      });

      // Emit notification to the appropriate user
      socket.emit('notificationUpdate', {
        id: new ObjectId().toString(),
        type: 'reply',
        message: isQuestion(originalDoc)
          ? `${comment.commentBy} commented on your question "${originalDoc.title}"`
          : `${comment.commentBy} commented on your answer to "${originalDoc.question.title}"`,
        timestamp: new Date(),
        read: false,
        userId: isQuestion(originalDoc) ? originalDoc.askedBy : originalDoc.ansBy,
        relatedId: id,
      });

      res.json(comFromDb);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when adding comment: ${err.message}`);
      } else {
        res.status(500).send('Error when adding comment');
      }
    }
  };

  router.post('/addComment', addCommentRoute);

  return router;
};

export default commentController;
