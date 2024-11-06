import React from 'react';
import { useNavigate } from 'react-router-dom';

interface UserProfileLinkProps {
  username: string;
  className?: string; // Added optional className prop for styling
}

const UserProfileLink = ({ username, className }: UserProfileLinkProps) => {
  const navigate = useNavigate(); // Initialize the navigate function at the top

  const handleClick = () => {
    navigate(`/profile/${username}`);
  };

  return (
    <div className={className} onClick={handleClick}>
      {username}
    </div>
  );
};

export default UserProfileLink;
