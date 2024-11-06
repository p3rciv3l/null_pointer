import React from 'react';
import './index.css';

interface HeaderProps {
  username: string | undefined;
  title: string;
  bio: string;
  date: string;
  reputation: number;
  goldBadge: number;
  silverBadge: number;
  bronzeBadge: number;
}

const ProfileHeader = ({
  username,
  title,
  bio,
  date,
  reputation,
  goldBadge,
  silverBadge,
  bronzeBadge,
}: HeaderProps) => (
  <div className='profile-header'>
    <div className='profile-info'>
      <div className='profile-header-main'>
        <h1>{username}</h1>
        <button className='follow-button'>Follow</button>
      </div>
      <h3>{title}</h3>
      <p>{bio}</p>
      <p>
        <strong>Joined:</strong> {date}
      </p>
    </div>
    <div className='profile-stats'>
      <div className='reputation'>
        <p>Reputation</p>
        <h2>{reputation}</h2>
      </div>
      <div className='badges'>
        <span className='badge gold'>🥇 {goldBadge}</span>
        <span className='badge silver'>🥈 {silverBadge}</span>
        <span className='badge bronze'>🥉 {bronzeBadge}</span>
      </div>
    </div>
  </div>
);

export default ProfileHeader;
