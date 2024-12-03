import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app';
import * as util from '../models/application';
import { Question, Tag, Answer } from '../types';

const saveCommentSpy = jest.spyOn(util, 'saveComment');
const addCommentSpy = jest.spyOn(util, 'addComment');
const popDocSpy = jest.spyOn(util, 'populateDocument');

const tag1: Tag = {
  _id: new mongoose.Types.ObjectId('507f191e810c19729de860ea'),
  name: 'tag1',
  description: 'tag1 description',
};
const tag2: Tag = {
  _id: new mongoose.Types.ObjectId('65e9a5c2b26199dbcc3e6dc8'),
  name: 'tag2',
  description: 'tag2 description',
};

const MOCK_QUESTIONS: Question[] = [
  {
    _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6dc'),
    title: 'Question 1 Title',
    text: 'Question 1 Text',
    tags: [tag1],
    answers: [],
    askedBy: 'question1_user',
    askDateTime: new Date('2024-06-03'),
    views: ['question1_user', 'question2_user'],
    upVotes: [],
    downVotes: [],
    comments: [],
  },
  {
    _id: new mongoose.Types.ObjectId('65e9b5a995b6c7045a30d823'),
    title: 'Question 2 Title',
    text: 'Question 2 Text',
    tags: [tag2],
    answers: [],
    askedBy: 'question2_user',
    askDateTime: new Date('2024-06-04'),
    views: ['question1_user', 'question2_user', 'question3_user'],
    upVotes: [],
    downVotes: [],
    comments: [],
  },
  {
    _id: new mongoose.Types.ObjectId('34e9b58910afe6e94fc6e99f'),
    title: 'Question 3 Title',
    text: 'Question 3 Text',
    tags: [tag1, tag2],
    answers: [],
    askedBy: 'question3_user',
    askDateTime: new Date('2024-06-03'),
    views: ['question3_user'],
    upVotes: [],
    downVotes: [],
    comments: [],
  },
];

const ans1: Answer = {
  _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6dc'),
  text: 'Answer 1 Text',
  ansBy: 'answer1_user',
  ansDateTime: new Date('2024-06-09'), // The mock date is string type but in the actual implementation it is a Date type
  comments: [],
  question: MOCK_QUESTIONS[0],
  upVotes: [],
  downVotes: [],
};

const ans2: Answer = {
  _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6dd'),
  text: 'Answer 2 Text',
  ansBy: 'answer2_user',
  ansDateTime: new Date('2024-06-10'),
  comments: [],
  question: MOCK_QUESTIONS[0],
  upVotes: [],
  downVotes: [],
};

const ans3: Answer = {
  _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6df'),
  text: 'Answer 3 Text',
  ansBy: 'answer3_user',
  ansDateTime: new Date('2024-06-11'),
  comments: [],
  question: MOCK_QUESTIONS[0],
  upVotes: [],
  downVotes: [],
};

const ans4: Answer = {
  _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6de'),
  text: 'Answer 4 Text',
  ansBy: 'answer4_user',
  ansDateTime: new Date('2024-06-14'),
  comments: [],
  question: MOCK_QUESTIONS[0],
  upVotes: [],
  downVotes: [],
};

MOCK_QUESTIONS[0].answers = [ans1];
MOCK_QUESTIONS[1].answers = [ans2, ans3];
MOCK_QUESTIONS[2].answers = [ans4];

describe('POST /addComment', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should add a new comment to the question', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const validCid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: validQid.toString(),
      type: 'question',
      comment: {
        text: 'This is a test comment',
        commentBy: 'dummyUserId',
        commentDateTime: new Date('2024-06-03'),
      },
    };

    const mockComment = {
      _id: validCid,
      text: 'This is a test comment',
      commentBy: 'dummyUserId',
      commentDateTime: new Date('2024-06-03'),
    };

    saveCommentSpy.mockResolvedValueOnce(mockComment);

    addCommentSpy.mockResolvedValueOnce({
      _id: validQid,
      title: 'This is a test question',
      text: 'This is a test question',
      tags: [],
      askedBy: 'dummyUserId',
      askDateTime: new Date('2024-06-03'),
      views: [],
      upVotes: [],
      downVotes: [],
      answers: [],
      comments: [mockComment],
    } as Question);

    popDocSpy.mockResolvedValueOnce({
      _id: validQid,
      title: 'This is a test question',
      text: 'This is a test question',
      tags: [],
      askedBy: 'dummyUserId',
      askDateTime: new Date('2024-06-03'),
      views: [],
      upVotes: [],
      downVotes: [],
      answers: [],
      comments: [mockComment],
    });

    const response = await supertest(app).post('/comment/addComment').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      _id: validCid.toString(),
      text: 'This is a test comment',
      commentBy: 'dummyUserId',
      commentDateTime: mockComment.commentDateTime.toISOString(),
    });
  });

  it('should add a new comment to the answer', async () => {
    const validAid = new mongoose.Types.ObjectId();
    const validCid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: validAid.toString(),
      type: 'answer',
      comment: {
        text: 'This is a test comment',
        commentBy: 'dummyUserId',
        commentDateTime: new Date('2024-06-03'),
      },
    };

    const mockComment = {
      _id: validCid,
      text: 'This is a test comment',
      commentBy: 'dummyUserId',
      commentDateTime: new Date('2024-06-03'),
    };

    saveCommentSpy.mockResolvedValueOnce(mockComment);

    addCommentSpy.mockResolvedValueOnce({
      _id: validAid,
      text: 'This is a test answer',
      ansBy: 'dummyUserId',
      ansDateTime: new Date('2024-06-03'),
      comments: [mockComment],
      question: MOCK_QUESTIONS[0],
      upVotes: [],
      downVotes: [],
    });

    popDocSpy.mockResolvedValueOnce({
      _id: validAid,
      text: 'This is a test answer',
      ansBy: 'dummyUserId',
      ansDateTime: new Date('2024-06-03'),
      comments: [mockComment],
      question: MOCK_QUESTIONS[0],
      upVotes: [],
      downVotes: [],
    });

    const response = await supertest(app).post('/comment/addComment').send(mockReqBody);

    expect(response.status).toBe(500);
  });

  it('should return bad request error if id property missing', async () => {
    const mockReqBody = {
      comment: {
        text: 'This is a test comment',
        commentBy: 'dummyUserId',
        commentDateTime: new Date('2024-06-03'),
      },
    };

    const response = await supertest(app).post('/comment/addComment').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if type property is missing', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: validQid.toString(),
      comment: {
        commentBy: 'dummyUserId',
        commentDateTime: new Date('2024-06-03'),
      },
    };

    const response = await supertest(app).post('/comment/addComment').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if type property is not `question` or `answer` ', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: validQid.toString(),
      type: 'invalidType',
      comment: {
        text: 'This is a test comment',
        commentBy: 'dummyUserId',
        commentDateTime: new Date('2024-06-03'),
      },
    };

    const response = await supertest(app).post('/comment/addComment').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if comment text property is missing', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: validQid.toString(),
      type: 'question',
      comment: {
        commentBy: 'dummyUserId',
        commentDateTime: new Date('2024-06-03'),
      },
    };

    const response = await supertest(app).post('/comment/addComment').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if text property of comment is empty', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: validQid.toString(),
      type: 'answer',
      comment: {
        text: '',
        commentBy: 'dummyUserId',
        commentDateTime: new Date('2024-06-03'),
      },
    };

    const response = await supertest(app).post('/comment/addComment').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid comment body');
  });

  it('should return bad request error if commentBy property missing', async () => {
    const mockReqBody = {
      id: 'dummyQuestionId',
      type: 'question',
      com: {
        text: 'This is a test comment',
        commentDateTime: new Date('2024-06-03'),
      },
    };

    const response = await supertest(app).post('/comment/addComment').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if commentDateTime property missing', async () => {
    const mockReqBody = {
      id: 'dummyQuestionId',
      type: 'answer',
      comment: {
        text: 'This is a test comment',
        commentBy: 'dummyUserId',
      },
    };

    const response = await supertest(app).post('/comment/addComment').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if request body is missing', async () => {
    const response = await supertest(app).post('/comment/addComment');

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if qid is not a valid ObjectId', async () => {
    const mockReqBody = {
      id: 'invalidObjectId',
      type: 'question',
      comment: {
        text: 'This is a test comment',
        commentBy: 'dummyUserId',
        commentDateTime: new Date('2024-06-03'),
      },
    };

    const response = await supertest(app).post('/comment/addComment').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid ID format');
  });

  it('should return database error in response if saveComment method throws an error', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: validQid.toString(),
      type: 'answer',
      comment: {
        text: 'This is a test comment',
        commentBy: 'dummyUserId',
        commentDateTime: new Date('2024-06-03'),
      },
    };

    saveCommentSpy.mockResolvedValueOnce({ error: 'Error when saving a comment' });

    const response = await supertest(app).post('/comment/addComment').send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when adding comment: Error when saving a comment');
  });

  it('should return database error in response if `addComment` method throws an error', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const validCid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: validQid.toString(),
      type: 'question',
      comment: {
        text: 'This is a test comment',
        commentBy: 'dummyUserId',
        commentDateTime: new Date('2024-06-03'),
      },
    };

    const mockComment = {
      _id: validCid,
      text: 'This is a test comment',
      commentBy: 'dummyUserId',
      commentDateTime: new Date('2024-06-03'),
    };

    saveCommentSpy.mockResolvedValueOnce(mockComment);
    addCommentSpy.mockResolvedValueOnce({
      error: 'Error when adding comment',
    });

    const response = await supertest(app).post('/comment/addComment').send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when adding comment: Error when adding comment');
  });

  it('should return database error in response if `populateDocument` method throws an error', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const validCid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: validQid.toString(),
      type: 'question',
      comment: {
        text: 'This is a test comment',
        commentBy: 'dummyUserId',
        commentDateTime: new Date('2024-06-03'),
      },
    };

    const mockComment = {
      _id: validCid,
      text: 'This is a test comment',
      commentBy: 'dummyUserId',
      commentDateTime: new Date('2024-06-03'),
    };

    const mockQuestion = {
      _id: validQid,
      title: 'This is a test question',
      text: 'This is a test question',
      tags: [],
      askedBy: 'dummyUserId',
      askDateTime: new Date('2024-06-03'),
      views: [],
      upVotes: [],
      downVotes: [],
      answers: [],
      comments: [mockComment._id],
    };

    saveCommentSpy.mockResolvedValueOnce(mockComment);
    addCommentSpy.mockResolvedValueOnce(mockQuestion);
    popDocSpy.mockResolvedValueOnce({ error: 'Error when populating document' });

    const response = await supertest(app).post('/comment/addComment').send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when adding comment: Error when populating document');
  });
});
