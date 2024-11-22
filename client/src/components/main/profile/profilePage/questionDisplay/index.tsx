import React from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';
import { Question } from '../../../../../types';

interface QuestionDisplayProps {
  questionsPosted: Question[];
}

const QuestionDisplay = ({ questionsPosted = [] }: QuestionDisplayProps) => {
  const navigate = useNavigate();

  const handleAnswer = (questionID: string) => {
    navigate(`/question/${questionID}`);
  };

  return (
    <div className='profile-questions-section'>
      <h2>Questions Asked</h2>
      {questionsPosted.length > 0 ? (
        questionsPosted.map(question => (
          <div
            key={question._id}
            className='question-item'
            onClick={() => {
              if (question._id) {
                handleAnswer(question._id);
              }
            }} // Add onClick event
          >
            <h3 className='question-title'>{question.title}</h3>
            <div className='question-tags'>
              {question.tags.map((tag, index) => (
                <span key={index} className='question-tag'>
                  {tag.name}
                </span>
              ))}
            </div>
            <p className='question-date'>
              Asked on:{' '}
              {new Date(question.askDateTime).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        ))
      ) : (
        <p className='no-questions-message'>No questions have been posted yet.</p>
      )}
    </div>
  );
};

export default QuestionDisplay;
