// AIAnswerView.tsx
import React, { useEffect, useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Mistral } from '@mistralai/mistralai';

interface AIAnswerViewProps {
  questionText: string;
}

const AIAnswerView: React.FC<AIAnswerViewProps> = ({ questionText }) => {
  const [aiAnswer, setAiAnswer] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateAnswer = async () => {
      try {
        const apiKey = process.env.REACT_APP_MISTRAL_API_KEY;
        const client = new Mistral({ apiKey });

        const result = await client.chat.stream({
          model: 'mistral-small-latest',
          messages: [
            {
              role: 'user',
              content: `Answer concisely, and try not to use code generation. Don't use markdown either to respond: ${questionText}`,
            },
          ],
        });

        for await (const chunk of result) {
          const streamText = chunk.data.choices[0].delta.content;
          setAiAnswer(current => current + streamText);
        }

        setIsLoading(false);
      } catch (error) {
        setAiAnswer('Failed to generate AI answer. Please try again later.');
        setIsLoading(false);
      }
    };

    generateAnswer();
  }, [questionText]);

  return (
    <div className='answer-container'>
      <div className='answer-content'>
        {isLoading ? (
          <div className='loading'>AI is thinking...</div>
        ) : (
          <>
            <div className='answer-text'>{aiAnswer}</div>
          </>
        )}
      </div>
    </div>
  );
};
export default AIAnswerView;
