import React from 'react';
import './index.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Award, Calendar, Medal, Trophy } from 'lucide-react';

interface ProfileCardProps {
  username: string | undefined;
  title: string;
  bio: string;
  date: string;
  reputation: number;
  goldBadge: number;
  silverBadge: number;
  bronzeBadge: number;
}

const ProfileCard = ({
  username,
  title,
  bio,
  date,
  goldBadge,
  silverBadge,
  bronzeBadge,
}: ProfileCardProps) => (
  <div className='profile-header'>
    <div className='profile-avatar'>
      <span className='profile-avatar-letter'>{username?.charAt(0)}</span>
    </div>
    <h1 className='profile-name'>{username}</h1>
    <h2 className='profile-title'>{title}</h2>
    <div className='profile-join-date'>
      <Calendar className='w-4 h-4' />
      <span>Joined {date}</span>
    </div>
    <p className='profile-bio'>{bio}</p>
    <div className='badges-container'>
      <div className='badge-item'>
        <Trophy className='w-5 h-5' style={{ color: '#FFD700' }} />
        <span>{goldBadge}</span>
      </div>
      <div className='badge-item'>
        <Medal className='w-5 h-5' style={{ color: '#C0C0C0' }} />
        <span>{silverBadge}</span>
      </div>
      <div className='badge-item'>
        <Award className='w-5 h-5' style={{ color: '#CD7F32' }} />
        <span>{bronzeBadge}</span>
      </div>
    </div>
  </div>
);

export default ProfileCard;
