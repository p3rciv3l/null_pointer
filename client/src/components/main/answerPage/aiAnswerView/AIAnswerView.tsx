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
        // Extract language if specified
        const firstLineEnd = segment.indexOf('\n');
        const firstLine = segment.slice(3, firstLineEnd).trim();
        const code = segment.slice(firstLineEnd + 1, -3).trim();

        return (
          <div key={index} className='code-block'>
            {firstLine && <div className='code-language'>{firstLine}</div>}
            <pre>
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      // For regular text, split into lines and process each
      const lines = segment.split('\n');
      return lines.map((line, i) => {
        // Skip empty lines
        if (!line.trim()) {
          return <div key={`${index}-${i}`}>&nbsp;</div>;
        }

        // Check if it's a numbered list
        if (/^\d+\.\s/.test(line)) {
          return (
            <ol key={`${index}-${i}`} start={parseInt(line)}>
              <li>{line.replace(/^\d+\.\s/, '')}</li>
            </ol>
          );
        }

        // Bold text
        const boldText = line.replace(/\*\*(.*?)\*\*/g, '<em><strong>$1</strong></em>');

        // Regular text
        return <div key={`${index}-${i}`} dangerouslySetInnerHTML={{ __html: boldText }} />;
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
