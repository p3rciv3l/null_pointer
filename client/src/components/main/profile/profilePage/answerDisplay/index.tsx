import React from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';
import { Answer } from '../../../../../types';

interface AnswerDisplayProps {
  answersGiven: Answer[];
}

const answerDisplay = ({ answersGiven = [] }: AnswerDisplayProps) => {
  console.log('Answers Given:', answersGiven); // Log the answers array

  //   const navigate = useNavigate();

  //   const handleAnswer = (questionID: string) => {
  //     navigate(`/question/${questionID}`);
  //   }

  return (
    <div className='profile-answers-section'>
      <h2>Answers Given</h2>
      {answersGiven.length > 0 ? (
        answersGiven.map(answer => (
          <div key={answer._id} className='question-item'>
            <h3 className='answers-title'>{answer.text}</h3>
            <p className='answer-date'>
              Asked on:{' '}
              {new Date(answer.ansDateTime).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        ))
      ) : (
        <p className='no-questions-message'>No Answers have been posted yet.</p>
      )}
    </div>
  );
};

export default answerDisplay;
