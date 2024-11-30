import React from 'react';
import './index.css';
/**
 * Interface representing the props for the AnswerHeader component.
 *
 * - title - The title of the question or discussion thread.
 */
interface AnswerHeaderProps {
  title: string;
}

/**
 * AnswerHeader component that displays a header section for the answer page.
 */
const AnswerHeader = ({ title }: AnswerHeaderProps) => (
  <div className='answer_header_container'>{title}</div>
);

export default AnswerHeader;
