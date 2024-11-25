import React from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ThumbsUp, Clock } from 'lucide-react';
import { Comment, Answer } from '../../../../../types';
import { ContentCard } from '../profileComponents';

interface AnswerDisplayProps {
  activeTab: string;
  answersGiven: Answer[];
}

const AnswerDisplay = ({ activeTab = ' ', answersGiven = [] }: AnswerDisplayProps) => {
  const navigate = useNavigate();

  const handleAnswer = (questionID: string) => {
    navigate(`/question/${questionID}`);
  };

  return (
    <>
      {activeTab === 'answers' && (
        <div className='top-tags-container'>
          {answersGiven.map((answer, index) => (
            <ContentCard
              key={index}
              onClick={() => {
                if (answer.question) {
                  if (answer.question._id) {
                    handleAnswer(answer.question._id);
                  }
                }
              }}>
              <h3 className='question-title'>Re: {answer.question?.title}</h3>
              <p className='question-content'>{answer.text}</p>
              <div className='metrics-container'>
                <div className='metric'>
                  <ThumbsUp className='w-4 h-4' />
                  <span>{5}</span>
                </div>
                <div className='metric'>
                  <Clock className='w-4 h-4' />
                  <span>{new Date(answer.ansDateTime).toLocaleDateString()}</span>
                </div>
              </div>
              {answer.comments.length > 0 && (
                <div className='comments-section'>
                  {answer.comments.map((comment: Comment, idx: number) => (
                    <div key={idx} className='comment'>
                      <span className='comment-author'>{comment.commentBy}:</span> {comment.text}
                    </div>
                  ))}
                </div>
              )}
            </ContentCard>
          ))}
        </div>
      )}
    </>
  );
};

export default AnswerDisplay;
