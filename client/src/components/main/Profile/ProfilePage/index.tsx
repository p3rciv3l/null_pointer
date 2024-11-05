// ProfilePage.js
import React from 'react';
import { useParams } from 'react-router-dom';
import './index.css';

const ProfilePage = () => {
  const { username } = useParams();

  const user = {
    name: username,
    title: 'Computer Engineer',
    bio: 'Hello, I am a software developer simply trying to learn more on this platform! I specialize in Ubuntu, Information Security, and Software Engineering!',
    reputation: 2918,
    answers: 90,
    questions: 14,
    joinedWhen: new Date(),
    topTags: [
      { name: 'python', score: 29, posts: 35, points: 34 },
      { name: 'php', score: 10, posts: 16, points: 6 },
      { name: 'mysql', score: 4, posts: 4, points: 10 },
    ],
  };

  const formattedDate = user.joinedWhen.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className='profile-page'>
      <div className='profile-header'>
        <div className='profile-info'>
          <h1>{user.name}</h1>
          <h3>{user.title}</h3>
          <p>{user.bio}</p>
          <p>
            <strong>Joined:</strong> {formattedDate}
          </p>
        </div>
        <div className='profile-stats'>
          <div className='reputation'>
            <p>Reputation</p>
            <h2>{user.reputation}</h2>
          </div>
          <div className='badges'>
            <span className='badge gold'>🥇 2</span>
            <span className='badge silver'>🥈 11</span>
            <span className='badge bronze'>🥉 36</span>
          </div>
        </div>
      </div>

      <div className='profile-content'>
        <h2>Top Tags</h2>
        <div className='tags-list'>
          {user.topTags.map((tag, index) => (
            <div key={index} className='tag-container'>
              <span className='tag-name'>{tag.name}</span>
              <div className='tag-details'>
                <div>
                  <span className='stat-value'>{tag.score}</span>
                  <span className='stat-label'>score</span>
                </div>
                <div>
                  <span className='stat-value'>{tag.posts}</span>
                  <span className='stat-label'>posts</span>
                </div>
                <div>
                  <span className='stat-value'>{tag.points}</span>
                  <span className='stat-label'>points</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
