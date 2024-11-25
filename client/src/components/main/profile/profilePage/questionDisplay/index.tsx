import React from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ThumbsUp, Clock } from 'lucide-react';
import { Question, Comment, Tag } from '../../../../../types';
import { ContentCard } from '../profileComponents';

interface QuestionDisplayProps {
  activeTab: string;
  questionsPosted: Question[];
}

const QuestionDisplay = ({ activeTab = ' ', questionsPosted = [] }: QuestionDisplayProps) => {
  const navigate = useNavigate();

  const handleAnswer = (questionID: string) => {
    navigate(`/question/${questionID}`);
  };

  return (
    <>
      {activeTab === 'questions' && (
        <div className='top-tags-container'>
          {questionsPosted.map((question: Question, index: number) => (
            <ContentCard
              key={index}
              onClick={() => {
                if (question._id) {
                  handleAnswer(question._id);
                }
              }}>
              <h3 className='question-title'>{question.title}</h3>
              <p className='question-content'>{question.text}</p>
              <div className='tags-container'>
                {question.tags.map((tag: Tag, tagIndex: number) => (
                  <span key={tagIndex} className='tag'>
                    {tag.name}
                  </span>
                ))}
              </div>
              <div className='metrics-container'>
                <div className='metric'>
                  <ThumbsUp className='w-4 h-4' />
                  <span>{question.upVotes.length}</span>
                </div>
                <div className='metric'>
                  <Clock className='w-4 h-4' />
                  <span>{new Date(question.askDateTime).toLocaleDateString()}</span>
                </div>
              </div>
              {question.comments.length > 0 && (
                <div className='comments-section'>
                  {question.comments.map((comment: Comment, idx: number) => (
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

export default QuestionDisplay;
