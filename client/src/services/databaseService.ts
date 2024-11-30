import axios from 'axios';
import { Question, Answer, Comment, Tag } from '../types';

const API_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:8000';

// questions
export const addQuestion = async (question: Question): Promise<Question> => {
  try {
    const response = await axios.post(`${API_URL}/api/questions`, question);
    return response.data;
  } catch (error) {
    throw new Error('Error while creating a new question');
  }
};

export const getQuestionsByFilter = async (
  order: string = 'newest',
  search: string = '',
): Promise<Question[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/questions`, {
      params: { order, search },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error when fetching or filtering questions');
  }
};

// answers
export const addAnswer = async (questionId: string, answer: Answer): Promise<Answer> => {
  try {
    const response = await axios.post(`${API_URL}/api/questions/${questionId}/answers`, answer);
    return response.data;
  } catch (error) {
    throw new Error('Error while creating a new answer');
  }
};

export const getAnswers = async (questionId: string): Promise<Answer[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/questions/${questionId}/answers`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching answers');
  }
};

// comments
export const addComment = async (
  questionId: string,
  answerId: string | null,
  comment: Comment,
): Promise<Comment> => {
  try {
    const endpoint = answerId
      ? `/api/questions/${questionId}/answers/${answerId}/comments`
      : `/api/questions/${questionId}/comments`;
    const response = await axios.post(`${API_URL}${endpoint}`, comment);
    return response.data;
  } catch (error) {
    throw new Error('Error while creating a new comment');
  }
};

// tags
export const getTags = async (): Promise<Tag[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/tags`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching tags');
  }
};

// votes
export const addVote = async (
  questionId: string,
  answerId: string | null,
  voteType: 'up' | 'down',
): Promise<void> => {
  try {
    const endpoint = answerId
      ? `/api/questions/${questionId}/answers/${answerId}/vote`
      : `/api/questions/${questionId}/vote`;
    await axios.post(`${API_URL}${endpoint}`, { voteType });
  } catch (error) {
    throw new Error('Error while voting');
  }
};

// views
export const addView = async (questionId: string): Promise<void> => {
  try {
    await axios.post(`${API_URL}/api/questions/${questionId}/view`);
  } catch (error) {
    throw new Error('Error while adding view');
  }
};
