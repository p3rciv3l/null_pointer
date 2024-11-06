import React from 'react';
import './index.css';
import { Tag } from '../../../../../types';

interface QuestionDisplayProps {
  questionsPosted: {
    _id: string;
    title: string;
    tags: Tag[];
    askDateTime: Date;
  }[];
}

const QuestionDisplay = ({ questionsPosted }: QuestionDisplayProps) => (
  <div className='profile-questions-section'>
    <h2>Questions Asked</h2>
    {questionsPosted.map(question => (
      <div key={question._id} className='question-item'>
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
          {question.askDateTime.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>
    ))}
  </div>
);

export default QuestionDisplay;
