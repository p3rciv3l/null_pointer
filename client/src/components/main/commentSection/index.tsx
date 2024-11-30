import { useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ChevronDownIcon, ChevronUpIcon, MessageSquareIcon } from 'lucide-react';
import { getMetaData } from '../../../tool';
import { Comment } from '../../../types';
import './index.css';
import useUserContext from '../../../hooks/useUserContext';

/**
 * Interface representing the props for the Comment Section component.
 *
 * - comments - list of the comment components
 * - handleAddComment - a function that handles adding a new comment, taking a Comment object as an argument
 */
interface CommentSectionProps {
  comments: Comment[];
  handleAddComment: (comment: Comment) => void;
}

/**
 * CommentSection component shows the users all the comments and allows the users add more comments.
 *
 * @param comments: an array of Comment objects
 * @param handleAddComment: function to handle the addition of a new comment
 */
const CommentSection = ({ comments, handleAddComment }: CommentSectionProps) => {
  const { user } = useUserContext();
  const [text, setText] = useState<string>('');
  const [textErr, setTextErr] = useState<string>('');
  const [showComments, setShowComments] = useState<boolean>(false);

  /**
   * Function to handle the addition of a new comment.
   */
  const handleAddCommentClick = () => {
    if (text.trim() === '' || user.username.trim() === '') {
      setTextErr(text.trim() === '' ? 'Comment text cannot be empty' : '');
      return;
    }

    const newComment: Comment = {
      text,
      commentBy: user.username,
      commentDateTime: new Date(),
    };

    handleAddComment(newComment);
    setText('');
    setTextErr('');
  };

  return (
    <div className='comment-section'>
      <button onClick={() => setShowComments(!showComments)} className='comment-toggle'>
        <MessageSquareIcon className='comment-icon' />
        <span>{showComments ? 'Hide comments' : 'Show comments'}</span>
        {showComments ? (
          <ChevronUpIcon className='toggle-icon' />
        ) : (
          <ChevronDownIcon className='toggle-icon' />
        )}
      </button>

      {showComments && (
        <div className='comment-container'>
          <ul className='comment-list'>
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <li key={index} className='comment-item'>
                  <p className='comment-text'>{comment.text}</p>
                  <small className='comment-meta'>
                    {comment.commentBy}, {getMetaData(new Date(comment.commentDateTime))}
                  </small>
                </li>
              ))
            ) : (
              <p className='no-comments'>No comments yet.</p>
            )}
          </ul>

          <div className='add-comment-section'>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder='Add a comment...'
              className='comment-input'
              rows={2}
            />
            <button className='add-comment-btn' onClick={handleAddCommentClick}>
              Add Comment
            </button>
            {textErr && <small className='error-message'>{textErr}</small>}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
