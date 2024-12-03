import React from 'react';
import { useNavigate } from 'react-router-dom';

interface UserProfileLinkProps {
  username: string;
  className?: string; // Optional className prop for styling
  isIconPage?: boolean; // Optional field for reformatting in the icon of the header
}

const UserProfileLink = ({ username, className, isIconPage }: UserProfileLinkProps) => {
  const navigate = useNavigate(); // Initialize the navigate function at the top

  const handleClick = () => {
    navigate(`/profile/${username}`);
  };

  return (
    <div className={className} onClick={handleClick}>
      {isIconPage ? 'Profile' : username}
    </div>
  );
};

export default UserProfileLink;
