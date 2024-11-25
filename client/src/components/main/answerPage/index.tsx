import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MessageSquareIcon,
  PlusCircleIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  UserIcon,
} from 'lucide-react';
import { getMetaData } from '../../../tool';
import AnswerView from './answer';
import AnswerHeader from './header';
import { Comment } from '../../../types';
import QuestionBody from './questionBody';
import VoteComponent from '../voteComponent';
import CommentSection from '../commentSection';
import useAnswerPage from '../../../hooks/useAnswerPage';
import UserProfileLink from '../profile/profileLink';
import './index.css';
/**
 * AnswerPage component that displays the full content of a question along with its answers.
 * It also includes the functionality to vote, ask a new question, and post a new answer.
 */
const AnswerPage = () => {
  const { questionID, question, handleNewComment, handleNewAnswer } = useAnswerPage();

  if (!question) {
    return null;
  }

  return (
    <div className='page_container'>
      <div className='question_container'>
        {/* Voting System */}
        <VoteComponent question={question} />
        {/* Main Content */}
        <div className='question_content'>
          <h1 className='question_title'>{question.title}</h1>
          <div className='question_text'>{question.text}</div>
          <div className='tags_container'>
            {question.tags.map((tag, idx) => (
              <span
                key={idx} // Use only a single value (idx or tag) for the key
                className='tag'>
                {tag.name}
              </span>
            ))}
          </div>

          {/* Author Card */}
          <div className='author-card'>
            <div className='author-details'>
              <UserIcon className='author-icon' />
              <div className='author-info'>
                <h3 className='author-name'>{question.askedBy}</h3>
                <p className='author-meta'>{getMetaData(new Date(question.askDateTime))}</p>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <CommentSection
            comments={question.comments}
            handleAddComment={(comment: Comment) =>
              handleNewComment(comment, 'question', questionID)
            }
          />
        </div>
      </div>
      {/* Answers Section */}
      <section className='answers-section'>
        <h2 className='answers-title'>{question.answers.length} Answers</h2>
      </section>{' '}
      {question.answers.map((a, idx) => (
        <AnswerView
          key={idx}
          text={a.text}
          ansBy={a.ansBy}
          meta={getMetaData(new Date(a.ansDateTime))}
          comments={a.comments}
          handleAddComment={(comment: Comment) => handleNewComment(comment, 'answer', a._id)}
        />
      ))}
      <button
        className='answer-button'
        onClick={() => {
          handleNewAnswer();
        }}>
        Answer Question
      </button>
    </div>
  );
};

export default AnswerPage;
