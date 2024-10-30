// ProfilePage.js
import React, { useContext } from 'react';
import UserContext from '../../../contexts/UserContext';
import useUserContext from '../../../hooks/useUserContext';

const ProfilePage = () => {
  const { user } = useUserContext();

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1>{user.username} Profile</h1>
      <p>Email: {'user.email'}</p>
      <p>Reputation: {'user.reputation'}</p>
      {/* Add other profile details here */}
    </div>
  );
};

export default ProfilePage;
