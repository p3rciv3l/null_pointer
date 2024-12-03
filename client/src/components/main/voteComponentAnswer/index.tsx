// eslint-disable-next-line import/no-extraneous-dependencies
import { ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react';
import '../voteComponentQuestion/index.css';
import useUserContext from '../../../hooks/useUserContext';
import { Answer } from '../../../types';
import useVoteStatusAnswer from '../../../hooks/useVoteStatusAnswer';
import { downvoteAnswer, upvoteAnswer } from '../../../services/answerService';

/**
 * Interface represents the props for the VoteComponent.
 *
 * question - The question object containing voting information.
 */
interface VoteComponentAnswerProps {
  answer: Answer;
}

/**
 * A Vote component that allows users to upvote or downvote a question.
 *
 * @param answer - The answer object containing voting information.
 */
const VoteComponentAnswer = ({ answer }: VoteComponentAnswerProps) => {
  const { user } = useUserContext();
  const { count, voted } = useVoteStatusAnswer({ answer });

  /**
   * Function to handle upvoting or downvoting a question.
   *
   * @param type - The type of vote, either 'upvote' or 'downvote'.
   */
  const handleVote = async (type: 'upvote' | 'downvote') => {
    try {
      if (answer._id) {
        if (type === 'upvote') {
          await upvoteAnswer(answer._id, user.username);
        } else if (type === 'downvote') {
          await downvoteAnswer(answer._id, user.username);
        }
      }
    } catch (error) {
      // handle error.
    }
  };

  return (
    <div className='vote-container'>
      <button
        onClick={() => handleVote('upvote')}
        className={`vote-button ${voted === 1 ? 'vote-button-upvoted' : ''}`}
        aria-label='Upvote'>
        <ThumbsUpIcon className='icon' />
      </button>
      <span className='vote-count'>{count}</span>
      <button
        onClick={() => handleVote('downvote')}
        className={`vote-button ${voted === -1 ? 'vote-button-downvoted' : ''}`}
        aria-label='Downvote'>
        <ThumbsDownIcon className='icon' />
      </button>
    </div>
  );
};

export default VoteComponentAnswer;
