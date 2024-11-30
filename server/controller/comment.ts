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
<<<<<<< HEAD
=======
      // Get the original document to find its author
      const originalDoc = await populateDocument(id, type);
      if (!originalDoc || 'error' in originalDoc) {
        throw new Error('Original document not found');
      }

      // Type guard for Question and Answer
      // testing pull req.
      const isQuestion = (doc: any): doc is Question => 'title' in doc && 'askedBy' in doc;
      const isAnswer = (doc: any): doc is Answer => 'ansBy' in doc && 'question' in doc;

      if (!isQuestion(originalDoc) && !isAnswer(originalDoc)) {
        throw new Error('Invalid document type');
      }

>>>>>>> 3e319f949096e0be4c8aa4f0a076b4518db4ef7e
      const comFromDb = await saveComment(comment);
      if ('error' in comFromDb || !comFromDb._id) {
        throw new Error('error' in comFromDb ? comFromDb.error : 'Comment ID not found');
      }

      const status = await addComment(id, type, comFromDb);
      if (status && 'error' in status) {
        throw new Error(status.error);
      }

      const populatedDoc = await populateDocument(id, type);
      if (populatedDoc && 'error' in populatedDoc) {
        throw new Error(populatedDoc.error);
      }

      // Socket emissions for real-time updates
      socket.emit('commentUpdate', {
        result: populatedDoc,
        type,
      });

      // Emit notification
      if ('title' in populatedDoc) {
        socket.emit('notificationUpdate', {
          id: new ObjectId().toString(),
          type: 'reply',
          message: `${comment.commentBy} commented on your question "${populatedDoc.title}"`,
          timestamp: new Date(),
          read: false,
          userId: populatedDoc.askedBy,
          relatedId: id,
        });
      } else if ('question' in populatedDoc) {
        socket.emit('notificationUpdate', {
          id: new ObjectId().toString(),
          type: 'reply',
          message: `${comment.commentBy} commented on your answer to "${populatedDoc.question.title}"`,
          timestamp: new Date(),
          read: false,
          userId: populatedDoc.ansBy,
          relatedId: id,
        });
      }

      // Return the formatted comment response as expected by the test
      res.status(200).json({
        _id: comFromDb._id.toString(),
        text: comFromDb.text,
        commentBy: comFromDb.commentBy,
        commentDateTime: comFromDb.commentDateTime.toISOString(),
      });
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
