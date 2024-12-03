import { useEffect, useState } from 'react';
import { Answer } from '../types';
import useUserContext from './useUserContext';

/**
 * Custom hook to handle voting logic for a question.
 * It manages the current vote count, user vote status (upvoted, downvoted),
 * and handles real-time vote updates via socket events.
 *
 * @param answer - The question object for which the voting is tracked.
 *
 * @returns count - The urrent vote count (upVotes - downVotes)
 * @returns setCount - The function to manually update vote count
 * @returns voted - The user's vote status
 * @returns setVoted - The function to manually update user's vote status
 */

const useVoteStatusAnswer = ({ answer }: { answer: Answer }) => {
  const { user, socket } = useUserContext();
  const [count, setCount] = useState<number>(0);
  const [voted, setVoted] = useState<number>(0);

  useEffect(() => {
    /**
     * Function to get the current vote value for the user.
     *
     * @returns The current vote value for the user in the question, 1 for upvote, -1 for downvote, 0 for no vote.
     */
    const getVoteValue = () => {
      if (user.username && answer?.upVotes?.includes(user.username)) {
        return 1;
      }
      if (user.username && answer?.downVotes?.includes(user.username)) {
        return -1;
      }
      return 0;
    };

    // Set the initial count and vote value
    setCount((answer.upVotes || []).length - (answer.downVotes || []).length);
    setVoted(getVoteValue());
  }, [answer, user.username, socket]);

  return {
    count,
    setCount,
    voted,
    setVoted,
  };
};

export default useVoteStatusAnswer;
