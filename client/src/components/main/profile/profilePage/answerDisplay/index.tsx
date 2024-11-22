import React from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';
import { Answer } from '../../../../../types';

interface AnswerDisplayProps {
  answersGiven: Answer[];
  username?: string;
}

const AnswerDisplay = ({ answersGiven = [], username = 'Anonymous' }: AnswerDisplayProps) => {
  const navigate = useNavigate();

  const handleAnswer = (questionID: string) => {
    navigate(`/question/${questionID}`);
  };

  return (
    <div className='profile-answers-section'>
      <h2>Answers Given</h2>
      {answersGiven.length > 0 ? (
        answersGiven.map(answer => (
          <div
            key={answer._id}
            className='question-item'
            onClick={() => {
              if (answer.question && answer.question._id) {
                handleAnswer(answer.question._id);
              }
            }}>
            {/* Display question title */}
            <div className='question-header'>
              <h3 className='question-title'>{answer.question?.title || 'Unknown Question'}</h3>
              <p className='question-date'>
                Asked on:{' '}
                {new Date(answer.question?.askDateTime || '').toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            {/* Display user's answer */}
            <div className='answer-section'>
              <h4 className='answer-label'>{username} answered:</h4>
              <p className='answer-text'>{answer.text}</p>
            </div>
          </div>
        ))
      ) : (
        <p className='no-questions-message'>No Answers have been posted yet.</p>
      )}
    </div>
  );
};

export default AnswerDisplay;
