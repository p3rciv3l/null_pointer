import mongoose from 'mongoose';
import supertest from 'supertest';
import { ObjectId } from 'mongodb';
import { app } from '../app';
import * as util from '../models/application';
import { Answer, Question, Tag } from '../types'; // Adjust the import path as necessary

const saveAnswerSpy = jest.spyOn(util, 'saveAnswer');
const addAnswerToQuestionSpy = jest.spyOn(util, 'addAnswerToQuestion');
const popDocSpy = jest.spyOn(util, 'populateDocument');

const T1_DESC = 'Description for react';
const T2_DESC = 'Description for javascript';
const T3_DESC = 'Description for android';

const tag1: Tag = {
  _id: new ObjectId('507f191e810c19729de860ea'),
  name: 'react',
  description: T1_DESC,
};

const tag2: Tag = {
  _id: new ObjectId('65e9a5c2b26199dbcc3e6dc8'),
  name: 'javascript',
  description: T2_DESC,
};

const tag3: Tag = {
  _id: new ObjectId('65e9b4b1766fca9451cba653'),
  name: 'android',
  description: T3_DESC,
};

const QUESTIONS: Question[] = [
  {
    _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
    title: 'Quick question about storage on android',
    text: 'I would like to know the best way to go about storing an array on an android phone so that even when the app/activity ended the data remains',
    tags: [tag3, tag2],
    answers: [],
    askedBy: 'q_by1',
    askDateTime: new Date('2023-11-16T09:24:00'),
    views: ['question1_user', 'question2_user'],
    upVotes: [],
    downVotes: [],
    comments: [],
  },
  {
    _id: new ObjectId('65e9b5a995b6c7045a30d823'),
    title: 'Object storage for a web application',
    text: 'I am currently working on a website where, roughly 40 million documents and images should be served to its users. I need suggestions on which method is the most suitable for storing content with subject to these requirements.',
    tags: [tag1, tag2],
    answers: [],
    askedBy: 'q_by2',
    askDateTime: new Date('2023-11-17T09:24:00'),
    views: ['question2_user'],
    upVotes: [],
    downVotes: [],
    comments: [],
  },
  {
    _id: new ObjectId('65e9b9b44c052f0a08ecade0'),
    title: 'Is there a language to write programmes by pictures?',
    text: 'Does something like that exist?',
    tags: [],
    answers: [],
    askedBy: 'q_by3',
    askDateTime: new Date('2023-11-19T09:24:00'),
    views: ['question1_user', 'question2_user', 'question3_user', 'question4_user'],
    upVotes: [],
    downVotes: [],
    comments: [],
  },
  {
    _id: new ObjectId('65e9b716ff0e892116b2de09'),
    title: 'Unanswered Question #2',
    text: 'Does something like that exist?',
    tags: [],
    answers: [],
    askedBy: 'q_by4',
    askDateTime: new Date('2023-11-20T09:24:00'),
    views: [],
    upVotes: [],
    downVotes: [],
    comments: [],
  },
];

const ans1: Answer = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
  text: 'ans1',
  ansBy: 'ansBy1',
  ansDateTime: new Date('2023-11-18T09:24:00'),
  comments: [],
  question: QUESTIONS[0], // Add the associated question
  upVotes: [],
  downVotes: [],
};

const ans2: Answer = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6dd'),
  text: 'ans2',
  ansBy: 'ansBy2',
  ansDateTime: new Date('2023-11-20T09:24:00'),
  comments: [],
  question: QUESTIONS[0], // Add the associated question
  upVotes: [],
  downVotes: [],
};

const ans3: Answer = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6de'),
  text: 'ans3',
  ansBy: 'ansBy3',
  ansDateTime: new Date('2023-11-19T09:24:00'),
  comments: [],
  question: QUESTIONS[0], // Add the associated question
  upVotes: [],
  downVotes: [],
};

QUESTIONS[0].answers = [ans1, ans2];
QUESTIONS[1].answers = [ans1, ans2, ans3];

describe('POST /addAnswer', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should add a new answer to the question', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      qid: validQid,
      ans: {
        text: 'This is a test answer',
        ansBy: 'dummyUserId',
        ansDateTime: new Date('2024-06-03'),
      },
    };

    const mockAnswer = {
      _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
      text: 'This is a test answer',
      ansBy: 'dummyUserId',
      ansDateTime: new Date('2024-06-03'),
      comments: [],
      question: QUESTIONS[0],
      upVotes: [],
      downVotes: [],
    };
    saveAnswerSpy.mockResolvedValueOnce(mockAnswer);

    addAnswerToQuestionSpy.mockResolvedValueOnce({
      _id: validQid,
      title: 'This is a test question',
      text: 'This is a test question',
      tags: [],
      askedBy: 'dummyUserId',
      askDateTime: new Date('2024-06-03'),
      views: [],
      upVotes: [],
      downVotes: [],
      answers: [mockAnswer._id],
      comments: [],
    });

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
      answers: [mockAnswer],
      comments: [],
    });

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(500);
  });

  it('should return bad request error if answer text property is missing', async () => {
    const mockReqBody = {
      qid: 'dummyQuestionId',
      ans: {
        ansBy: 'dummyUserId',
        ansDateTime: new Date('2024-06-03'),
      },
    };

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid answer');
  });

  it('should return bad request error if request body has qid property missing', async () => {
    const mockReqBody = {
      ans: {
        ansBy: 'dummyUserId',
        ansDateTime: new Date('2024-06-03'),
      },
    };

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should return bad request error if answer object has ansBy property missing', async () => {
    const mockReqBody = {
      qid: 'dummyQuestionId',
      ans: {
        text: 'This is a test answer',
        ansDateTime: new Date('2024-06-03'),
      },
    };

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should return bad request error if answer object has ansDateTime property missing', async () => {
    const mockReqBody = {
      qid: 'dummyQuestionId',
      ans: {
        text: 'This is a test answer',
        ansBy: 'dummyUserId',
      },
    };

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should return bad request error if request body is missing', async () => {
    const response = await supertest(app).post('/answer/addAnswer');

    expect(response.status).toBe(400);
  });

  it('should return database error in response if saveAnswer method throws an error', async () => {
    const validQid = new mongoose.Types.ObjectId().toString();
    const mockReqBody = {
      qid: validQid,
      ans: {
        text: 'This is a test answer',
        ansBy: 'dummyUserId',
        ansDateTime: new Date('2024-06-03'),
      },
    };

    saveAnswerSpy.mockResolvedValueOnce({ error: 'Error when saving an answer' });

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(500);
  });

  it('should return database error in response if update question method throws an error', async () => {
    const validQid = new mongoose.Types.ObjectId().toString();
    const mockReqBody = {
      qid: validQid,
      ans: {
        text: 'This is a test answer',
        ansBy: 'dummyUserId',
        ansDateTime: new Date('2024-06-03'),
      },
    };

    const mockAnswer = {
      _id: new ObjectId('507f191e810c19729de860ea'),
      text: 'This is a test answer',
      ansBy: 'dummyUserId',
      ansDateTime: new Date('2024-06-03'),
      comments: [],
      question: QUESTIONS[0],
      upVotes: [],
      downVotes: [],
    };

    saveAnswerSpy.mockResolvedValueOnce(mockAnswer);
    addAnswerToQuestionSpy.mockResolvedValueOnce({ error: 'Error when adding answer to question' });

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(500);
  });

  it('should return database error in response if `populateDocument` method throws an error', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      qid: validQid,
      ans: {
        text: 'This is a test answer',
        ansBy: 'dummyUserId',
        ansDateTime: new Date('2024-06-03'),
      },
    };

    const mockAnswer = {
      _id: new ObjectId('507f191e810c19729de860ea'),
      text: 'This is a test answer',
      ansBy: 'dummyUserId',
      ansDateTime: new Date('2024-06-03'),
      comments: [],
      question: QUESTIONS[0],
      upVotes: [],
      downVotes: [],
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
      answers: [mockAnswer._id],
      comments: [],
    };

    saveAnswerSpy.mockResolvedValueOnce(mockAnswer);
    addAnswerToQuestionSpy.mockResolvedValueOnce(mockQuestion);
    popDocSpy.mockResolvedValueOnce({ error: 'Error when populating document' });

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(500);
  });
});

jest.mock('../models/application'); // Mock the utility methods
const saveAnswerMock = jest.spyOn(util, 'saveAnswer');
const addAnswerToQuestionMock = jest.spyOn(util, 'addAnswerToQuestion');
const populateDocumentMock = jest.spyOn(util, 'populateDocument');
const fetchAndIncrementQuestionViewsByIdMock = jest.spyOn(
  util,
  'fetchAndIncrementQuestionViewsById',
);

describe('POST /answer/addAnswer', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Disconnect mongoose after all tests
  });

  it('should not add a new answer and return it in the response', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      qid: validQid.toString(),
      ans: {
        text: 'This is a valid test answer',
        ansBy: 'testUser',
        ansDateTime: new Date(),
      },
    };

    const mockAnswer: Answer = {
      _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
      text: 'This is a valid test answer',
      ansBy: 'testUser',
      ansDateTime: new Date(),
      comments: [],
      question: QUESTIONS[0], // Add the associated question
      upVotes: [],
      downVotes: [],
    };

    saveAnswerMock.mockResolvedValueOnce(mockAnswer);
    populateDocumentMock.mockResolvedValueOnce(mockAnswer);

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(500);
  });

  it('should return 400 if `qid` is missing', async () => {
    const mockReqBody = {
      ans: {
        text: 'This is a valid test answer',
        ansBy: 'testUser',
        ansDateTime: new Date(),
      },
    };

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return 400 if `text` is missing in the answer', async () => {
    const mockReqBody = {
      qid: 'dummyQuestionId',
      ans: {
        ansBy: 'testUser',
        ansDateTime: new Date(),
      },
    };

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid answer');
  });

  it('should return 500 if `fetchAndIncrementQuestionViewsById` fails', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      qid: validQid.toString(),
      ans: {
        text: 'This is a valid test answer',
        ansBy: 'testUser',
        ansDateTime: new Date(),
      },
    };

    fetchAndIncrementQuestionViewsByIdMock.mockResolvedValueOnce({ error: 'Question not found' });

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toContain('Error when adding answer');
  });

  it('should return 500 if `saveAnswer` fails', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      qid: validQid.toString(),
      ans: {
        text: 'This is a valid test answer',
        ansBy: 'testUser',
        ansDateTime: new Date(),
      },
    };

    saveAnswerMock.mockResolvedValueOnce({ error: 'Save answer failed' });

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toContain('Error when adding answer');
  });

  it('should return 500 if `addAnswerToQuestion` fails', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      qid: validQid.toString(),
      ans: {
        text: 'This is a valid test answer',
        ansBy: 'testUser',
        ansDateTime: new Date(),
      },
    };

    const mockAnswer: Answer = {
      _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
      text: 'This is a valid test answer',
      ansBy: 'testUser',
      ansDateTime: new Date(),
      comments: [],
      question: QUESTIONS[0], // Add the associated question
      upVotes: [],
      downVotes: [],
    };

    saveAnswerMock.mockResolvedValueOnce(mockAnswer);
    addAnswerToQuestionMock.mockResolvedValueOnce({ error: 'Failed to update question' });

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toContain('Error when adding answer');
  });

  it('should return 500 if `populateDocument` fails', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      qid: validQid.toString(),
      ans: {
        text: 'This is a valid test answer',
        ansBy: 'testUser',
        ansDateTime: new Date(),
      },
    };

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toContain('Error when adding answer');
  });
});
