// AIAnswerView.tsx
import React, { useEffect, useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Mistral } from '@mistralai/mistralai';

interface AIAnswerViewProps {
  questionText: string;
}

const AIAnswerView: React.FC<AIAnswerViewProps> = ({ questionText }) => {
  const [aiAnswer, setAiAnswer] = useState<React.ReactNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const renderText = (text: string) => {
    // Split by code blocks first
    const segments = text.split(/(```[\s\S]*?```)/);

    return segments.map((segment, index) => {
      // If it's a code block
      if (segment.startsWith('```') && segment.endsWith('```')) {
        const code = segment.slice(3, -3).trim();
        return (
          <div key={index} className='code-block'>
            <pre>{code}</pre>
          </div>
        );
      }

      // For regular text, handle numbered lists and headers
      const lines = segment.split('\n');
      return lines.map((line, i) => {
        // Headers
        if (line.startsWith('#')) {
          const match = line.match(/^#+/);
          if (match) {
            const level = Math.min(match[0].length, 6);
            return React.createElement(
              `h${level}`,
              { key: `${index}-${i}` },
              line.slice(level + 1),
            );
          }
        }
        // Regular text
        return <div key={`${index}-${i}`}>{line}</div>;
      });
    });
  };

  useEffect(() => {
    const generateAnswer = async () => {
      try {
        const apiKey = process.env.REACT_APP_MISTRAL_API_KEY;
        const client = new Mistral({ apiKey });
        let fullText = '';

        const result = await client.chat.stream({
          model: 'mistral-small-latest',
          messages: [
            {
              role: 'user',
              content: `You are a helpful programming assistant. Format your response using these rules:
- Use numbered lists for steps or sequences
- Use **text** for emphasis of important concepts
- Use \`code\` for short code references
- Use \`\`\` for longer code examples
- Keep explanations clear and concise
- Break complex answers into logical sections

Question: ${questionText}`,
            },
          ],
        });

        for await (const chunk of result) {
          const streamText = chunk.data.choices[0].delta.content;
          fullText += streamText;
          setAiAnswer(renderText(fullText));
        }

        setIsLoading(false);
      } catch (error) {
        setAiAnswer([<div key='error'>Failed to generate AI answer. Please try again later.</div>]);
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
          <div className='answer-text'>{aiAnswer}</div>
        )}
      </div>
    </div>
  );
};
export default AIAnswerView;
