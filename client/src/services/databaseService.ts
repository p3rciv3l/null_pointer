import { ref, set, get, push, update, query, orderByChild, DatabaseReference } from 'firebase/database';
import { database } from '../config/firebase';
import { Question, Answer, Comment, Tag, TagData } from '../types';

// Questions
export const addQuestion = async (question: Question): Promise<Question> => {
  try {
    const newQuestionRef = push(ref(database, 'questions'));
    const questionWithId = { ...question, _id: newQuestionRef.key ?? '' };
    await set(newQuestionRef, questionWithId);
    return questionWithId;
  } catch (error) {
    throw new Error('Error while creating a new question');
  }
};

export const getQuestionsByFilter = async (
  order: string = 'newest',
  search: string = '',
): Promise<Question[]> => {
  try {
    const questionsRef = ref(database, 'questions');
    const snapshot = await get(questionsRef);
    
    if (!snapshot.exists()) return [];
    
    let questions = Object.entries(snapshot.val()).map(([key, value]) => ({
      ...(value as Question),
      _id: key,
    }));

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      questions = questions.filter(q => 
        q.title.toLowerCase().includes(searchLower) ||
        q.text.toLowerCase().includes(searchLower)
      );
    }

    // Apply ordering
    switch (order) {
      case 'newest':
        questions.sort((a, b) => 
          new Date(b.askDateTime).getTime() - new Date(a.askDateTime).getTime()
        );
        break;
      case 'active':
        questions.sort((a, b) => b.answers.length - a.answers.length);
        break;
      case 'unanswered':
        questions = questions.filter(q => q.answers.length === 0);
        break;
      case 'mostViewed':
        questions.sort((a, b) => b.views.length - a.views.length);
        break;
    }

    return questions;
  } catch (error) {
    throw new Error('Error when fetching or filtering questions');
  }
};

export const getQuestionById = async (qid: string, username: string): Promise<Question> => {
  try {
    const questionRef = ref(database, `questions/${qid}`);
    const snapshot = await get(questionRef);
    
    if (!snapshot.exists()) {
      throw new Error('Question not found');
    }
    
    const question = { ...snapshot.val(), _id: qid } as Question;
    
    // Add view if not already viewed
    if (!question.views.includes(username)) {
      question.views.push(username);
      await update(questionRef, { views: question.views });
    }
    
    return question;
  } catch (error) {
    throw new Error('Error when fetching question by id');
  }
};

// Answers
export const addAnswer = async (qid: string, answer: Answer): Promise<Answer> => {
  try {
    const questionRef = ref(database, `questions/${qid}`);
    const newAnswerRef = push(ref(database, `questions/${qid}/answers`));
    const answerWithId = { ...answer, _id: newAnswerRef.key ?? '' };
    
    await set(newAnswerRef, answerWithId);
    return answerWithId;
  } catch (error) {
    throw new Error('Error while creating a new answer');
  }
};

// Comments
export const addComment = async (
  id: string,
  type: 'question' | 'answer',
  comment: Comment,
): Promise<Comment> => {
  try {
    const path = type === 'question' 
      ? `questions/${id}/comments`
      : `questions/${id}/answers/${id}/comments`;
      
    const newCommentRef = push(ref(database, path));
    const commentWithId = { ...comment, _id: newCommentRef.key ?? '' };
    
    await set(newCommentRef, commentWithId);
    return commentWithId;
  } catch (error) {
    throw new Error('Error while creating a new comment');
  }
};

// Votes
export const upvoteQuestion = async (qid: string, username: string): Promise<void> => {
  try {
    const questionRef = ref(database, `questions/${qid}`);
    const snapshot = await get(questionRef);
    
    if (!snapshot.exists()) {
      throw new Error('Question not found');
    }
    
    const question = snapshot.val() as Question;
    
    if (!question.upVotes.includes(username)) {
      const updates = {
        upVotes: [...question.upVotes, username],
        downVotes: question.downVotes.filter(u => u !== username),
      };
      await update(questionRef, updates);
    }
  } catch (error) {
    throw new Error('Error while upvoting the question');
  }
};

export const downvoteQuestion = async (qid: string, username: string): Promise<void> => {
  try {
    const questionRef = ref(database, `questions/${qid}`);
    const snapshot = await get(questionRef);
    
    if (!snapshot.exists()) {
      throw new Error('Question not found');
    }
    
    const question = snapshot.val() as Question;
    
    if (!question.downVotes.includes(username)) {
      const updates = {
        downVotes: [...question.downVotes, username],
        upVotes: question.upVotes.filter(u => u !== username),
      };
      await update(questionRef, updates);
    }
  } catch (error) {
    throw new Error('Error while downvoting the question');
  }
};

// Tags
export const getTagsWithQuestionNumber = async (): Promise<TagData[]> => {
  try {
    const questionsRef = ref(database, 'questions');
    const snapshot = await get(questionsRef);
    
    if (!snapshot.exists()) return [];
    
    const questions = Object.values(snapshot.val()) as Question[];
    const tagCounts = new Map<string, number>();
    const tagDescriptions = new Map<string, string>();
    
    questions.forEach(question => {
      question.tags.forEach(tag => {
        tagCounts.set(tag.name, (tagCounts.get(tag.name) || 0) + 1);
        tagDescriptions.set(tag.name, tag.description);
      });
    });
    
    return Array.from(tagCounts.entries()).map(([name, count]) => ({
      name,
      description: tagDescriptions.get(name) || '',
      qcnt: count,
    }));
  } catch (error) {
    throw new Error('Error when fetching tags with question number');
  }
};

export const getTagByName = async (name: string): Promise<Tag> => {
  try {
    const questionsRef = ref(database, 'questions');
    const snapshot = await get(questionsRef);
    
    if (!snapshot.exists()) {
      throw new Error('Tag not found');
    }
    
    const questions = Object.values(snapshot.val()) as Question[];
    const tag = questions
      .flatMap(q => q.tags)
      .find(t => t.name === name);
    
    if (!tag) {
      throw new Error('Tag not found');
    }
    
    return tag;
  } catch (error) {
    throw new Error(`Error when fetching tag: ${name}`);
  }
}; 