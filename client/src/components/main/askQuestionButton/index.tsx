// eslint-disable-next-line import/no-extraneous-dependencies
import { PlusSquare } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * AskQuestionButton component that renders a button for navigating to the
 * "New Question" page. When clicked, it redirects the user to the page
 * where they can ask a new question.
 */
const AskQuestionButton = () => {
  const navigate = useNavigate();

  /**
   * Function to handle navigation to the "New Question" page.
   */
  const handleNewQuestion = () => {
    navigate('/new/question');
  };

  return (
    <button
      className='ask-btn'
      onClick={() => {
        handleNewQuestion();
      }}>
      <PlusSquare className='w-4 h-4' />
      Ask a Question
    </button>
  );
};

export default AskQuestionButton;
