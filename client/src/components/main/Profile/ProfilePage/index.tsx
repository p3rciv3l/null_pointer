// ProfilePage.js
import React from 'react';
import { useParams } from 'react-router-dom';

const ProfilePage = () => {
  // Right now this is wrong, I am getting the username of the person logged in.

  // if (!user) return <p>Loading...</p>;
  const { username } = useParams();

  return (
    <div>
      <h1>{username} Profile</h1>
      <p>Email: {'user.email'}</p>
      <p>Reputation: {'user.reputation'}</p>
      {/* Add other profile details here */}
    </div>
  );
};

export default ProfilePage;
