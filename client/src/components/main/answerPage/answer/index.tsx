import React from 'react';
import { getMetaData, handleHyperlink } from '../../../../tool';
import CommentSection from '../../commentSection';
import './index.css';
import { Answer, Comment } from '../../../../types';
import UserProfileLink from '../../profile/profileLink';
import VoteComponentAnswer from '../../voteComponentAnswer';

/**
 * Interface representing the props for the AnswerView component.
 *
 * - text: The content of the answer.
 * - ansBy: The username of the user who wrote the answer.
 * - meta: Additional metadata related to the answer.
 * - comments: An array of comments associated with the answer.
 * - handleAddComment: Callback function to handle adding a new comment.
 */
interface AnswerProps {
  answer: Answer;
  handleAddComment: (comment: Comment) => void;
}

/**
 * AnswerView component that displays the content of an answer with the author's name and metadata.
 */

const AnswerView = ({ answer, handleAddComment }: AnswerProps) => (
  <div className='answer-container'>
    <VoteComponentAnswer answer={answer} />
    <div className='answer-wrapper'>
      <div className='answer-content-group'>
        {/* Meta container */}
        <div className='answer-meta-container'>
          <UserProfileLink username={answer.ansBy} className='answer-author' />
          <span className='answer-meta'>{getMetaData(new Date(answer.ansDateTime))}</span>
        </div>
        {/* Answer content */}
        <div className='answer-content'>
          <p className='answer-text'>{handleHyperlink(answer.text)}</p>
        </div>

        {/* Comments section */}
        <div className='answer-comment-section'>
          <CommentSection comments={answer.comments} handleAddComment={handleAddComment} />
        </div>
      </div>
    </div>
  </div>
);

export default AnswerView;
