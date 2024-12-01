// AIAnswerView.tsx
import React, { useEffect, useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Mistral } from '@mistralai/mistralai';

interface AIAnswerViewProps {
  questionText: string;
}

const AIAnswerView: React.FC<AIAnswerViewProps> = ({ questionText }) => {
  const [processedAnswer, setProcessedAnswer] = useState<React.ReactNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
          setProcessedAnswer(renderMarkdown(fullText));
        }

        setIsLoading(false);
      } catch (error) {
        setProcessedAnswer([
          <div key='error'>Failed to generate AI answer. Please try again later.</div>,
        ]);
        setIsLoading(false);
      }
    };

    generateAnswer();
  }, [questionText]);

  const renderMarkdown = (text: string) => {
    // Split the text into segments to process code blocks separately
    const segments = text.split(/(```[\s\S]*?```)/);

    return segments.map((segment, index) => {
      // Handle code blocks
      if (segment.startsWith('```') && segment.endsWith('```')) {
        const code = segment.slice(3, -3).trim();
        return (
          <div key={index} className='code-block'>
            <pre>{code}</pre>
          </div>
        );
      }

      // Process regular text
      return (
        <div key={index}>
          {segment
            // Handle inline code
            .split(/('.*?')/)
            .map((part, i) => {
              if (part.startsWith("'") && part.endsWith("'")) {
                return (
                  <span key={i} className='inline-code'>
                    {part.slice(1, -1)}
                  </span>
                );
              }

              // Handle bold text
              return part.split(/(\*\*.*?\*\*)/).map((boldPart, j) => {
                if (boldPart.startsWith('**') && boldPart.endsWith('**')) {
                  return (
                    <span key={j} className='bold-text'>
                      {boldPart.slice(2, -2)}
                    </span>
                  );
                }
                return boldPart;
              });
            })}
        </div>
      );
    });
  };

  return (
    <div className='answer-container'>
      <div className='answer-content'>
        {isLoading ? (
          <div className='loading'>AI is thinking...</div>
        ) : (
          <div className='answer-text'>{processedAnswer}</div>
        )}
      </div>
    </div>
  );
};
export default AIAnswerView;
