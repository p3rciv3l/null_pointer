import { ThumbsDownIcon, ThumbsUpIcon, CheckCircle2 } from 'lucide-react';
import '../voteComponentQuestion/index.css';
import useUserContext from '../../../hooks/useUserContext';
import { Answer } from '../../../types';
import useVoteStatusAnswer from '../../../hooks/useVoteStatusAnswer';
import { downvoteAnswer, upvoteAnswer } from '../../../services/answerService';

interface VoteComponentAnswerProps {
  answer: Answer;
}

const VoteComponentAnswer = ({ answer }: VoteComponentAnswerProps) => {
  const { user } = useUserContext();
  const { count, voted } = useVoteStatusAnswer({ answer });
  const showCertified = count > 3;

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
    <div className='vote-container-wrapper'>
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
      {showCertified && (
        <div className='certified-badge'>
          <CheckCircle2 className='certified-icon' />
          <span className='certified-text'>Certified Answer</span>
        </div>
      )}
    </div>
  );
};

export default VoteComponentAnswer;
