// AIAnswerView.tsx
import React, { useEffect, useState } from 'react';
import { UserIcon } from 'lucide-react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Mistral } from '@mistralai/mistralai';
import { getMetaData } from '../../../../tool';
import CommentSection from '../../commentSection';
import { Comment } from '../../../../types';

interface AIAnswerViewProps {
  questionText: string;
  handleAddComment: (comment: Comment) => void;
}

const AIAnswerView: React.FC<AIAnswerViewProps> = ({ questionText, handleAddComment }) => {
  const [aiAnswer, setAiAnswer] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateAnswer = async () => {
      try {
        const apiKey = process.env.MISTRAL_API_KEY;
        const client = new Mistral({ apiKey });

        let fullAnswer = '';
        const result = await client.chat.stream({
          model: 'mistral-small-latest',
          messages: [{ role: 'user', content: questionText }],
        });

        for await (const chunk of result) {
          const streamText = chunk.data.choices[0].delta.content;
          fullAnswer += streamText;
          setAiAnswer(current => current + streamText);
        }

        setIsLoading(false);
      } catch (error) {
        console.log('Error text', error);
        setAiAnswer('Failed to generate AI answer. Please try again later.');
        setIsLoading(false);
      }
    };

    generateAnswer();
  }, [questionText]);

  // TODO: When the ability to upvote answers is supported, add a vote Component here!
  // Also, consider the ability to add comments. Should this answer be something which is saved
  // in the database, or just displayed?
  return (
    <div className='answer-container'>
      <div className='answer-content'>
        {isLoading ? (
          <div className='loading'>Generating AI Answer...</div>
        ) : (
          <>
            <div className='answer-text'>{aiAnswer}</div>
            <div className='author-card'>
              <div className='author-details'>
                <UserIcon className='author-icon' />
                <div className='author-info'>
                  <h3 className='author-name'>AI Assistant</h3>
                  <p className='author-meta'>{getMetaData(new Date())}</p>
                </div>
              </div>
            </div>
            {/* <CommentSection comments={[]} handleAddComment={handleAddComment} /> */}
          </>
        )}
      </div>
    </div>
  );
};
export default AIAnswerView;
