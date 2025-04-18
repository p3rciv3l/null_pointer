// eslint-disable-next-line import/no-extraneous-dependencies
import { ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react';
import { downvoteQuestion, upvoteQuestion } from '../../../services/questionService';
import './index.css';
import useUserContext from '../../../hooks/useUserContext';
import { Question } from '../../../types';
import useVoteStatus from '../../../hooks/useVoteStatus';

/**
 * Interface represents the props for the VoteComponent.
 *
 * question - The question object containing voting information.
 */
interface VoteComponentProps {
  question: Question;
}

/**
 * A Vote component that allows users to upvote or downvote a question.
 *
 * @param question - The question object containing voting information.
 */
const VoteComponentQuestion = ({ question }: VoteComponentProps) => {
  const { user } = useUserContext();
  const { count, voted } = useVoteStatus({ question });

  /**
   * Function to handle upvoting or downvoting a question.
   *
   * @param type - The type of vote, either 'upvote' or 'downvote'.
   */
  const handleVote = async (type: 'upvote' | 'downvote') => {
    try {
      if (question._id) {
        if (type === 'upvote') {
          await upvoteQuestion(question._id, user.username);
        } else if (type === 'downvote') {
          await downvoteQuestion(question._id, user.username);
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

export default VoteComponentQuestion;
