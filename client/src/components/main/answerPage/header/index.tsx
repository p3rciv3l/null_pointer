import React from 'react';
import './index.css';
import { Question } from '../../../../types';
import VoteComponent from '../../voteComponent';
/**
 * Interface representing the props for the AnswerHeader component.
 *
 * - ansCount - The number of answers to display in the header.
 * - title - The title of the question or discussion thread.
 */
interface AnswerHeaderProps {
  question: Question;
}

/**
 * AnswerHeader component that displays a header section for the answer page.
 */
const AnswerHeader = ({ question }: AnswerHeaderProps) => (
  <div className='answer_header_container'>
    <div className='answer_header_left'>
      <VoteComponent question={question} />
    </div>
    <div className='answer_header_right'>
      <div className='bold_title answer_question_title'>{question.title}</div>
    </div>
  </div>
);

export default AnswerHeader;
