import React from 'react';
import { useParams } from 'react-router-dom';
import './index.css';

const ProfilePage = () => {
  const { username } = useParams();

  /**
   * In the later implementations of this page, we need a hook
   * to grab the Profile datatype associated with this username.
   * Since we utilize username as a unique ID, and it is enforced upon creation
   * in MongoDB, we should not run into any errors.
   */

  // Trying to project what we would actually calculate to display on our Profile.
  // This is something that is again TBD, so this dummy data could change. We wanted to ensure that
  // the skeleton for the HTML framework was there, so that later modifications wouldn't take too much
  // time.
  const user = {
    name: username,
    title: 'Computer Engineer',
    location: 'Turkey',
    reputation: 2918,
    answers: 90,
    questions: 14,
    peopleReached: '~39k',
    communities: [
      { name: 'Stack Overflow', rep: '2.9k' },
      { name: 'Ask Ubuntu', rep: '806' },
      { name: 'Information Security', rep: '186' },
      { name: 'Software Engineering', rep: '142' },
    ],
    topTags: [
      { name: 'python', score: 29, posts: 35, points: 34 },
      { name: 'php', score: 10, posts: 16, points: 6 },
      { name: 'mysql', score: 4, posts: 4 },
    ],
  };

  return (
    <div className='profile-page-main-divider'>
      {/* Profile Header */}
      <div className='gap-between'>
        {/* Avatar Section */}
        <div className='flex flex-col items-center gap-2'>
          <div className='text-center'>
            <div className='text-sm text-gray-600'>
              REPUTATION
              <div className='reputation-score text-2xl font-bold' data-tooltip='Reputation Score'>
                {user.reputation}
              </div>
            </div>
          </div>
          <div className='flex gap-2 text-sm'>
            <span className='badge gold px-2 py-1 rounded' data-tooltip='Gold Badges'>
              🏆 2
            </span>
            <span className='badge silver px-2 py-1 rounded' data-tooltip='Silver Badges'>
              ⚫ 11
            </span>
            <span className='badge bronze px-2 py-1 rounded' data-tooltip='Bronze Badges'>
              🥉 36
            </span>
          </div>
        </div>

        {/* Profile Info */}
        <div className='flex-1'>
          <h1 className='text-2xl font-bold mb-2'>{user.name}</h1>
          <div className='text-gray-600 mb-4'>{user.title}</div>

          <div className='flex items-center gap-4 text-sm text-gray-600 mb-6'>
            <span>📍 {user.location}</span>
            <span className='flex items-center gap-1'>
              <span className='font-medium'>{user.answers}</span> answers
            </span>
            <span className='flex items-center gap-1'>
              <span className='font-medium'>{user.questions}</span> questions
            </span>
            <span className='flex items-center gap-1'>
              <span className='font-medium'>{user.peopleReached}</span> people reached
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='profile-content flex gap-6'>
        {/* Left Column */}
        <div className='profile-sidebar w-48'>
          <div className='mb-6'>
            <h2 className='text-lg font-bold mb-3'>Communities</h2>
            <div className='space-y-2'>
              {user.communities.map((community, index) => (
                <div key={index} className='community-item flex justify-between items-center'>
                  <a href='#' className='community-link'>
                    {community.name}
                  </a>
                  <span className='community-reputation'>{community.rep}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className='flex-1'>
          <h2 className='text-lg font-bold mb-3'>Top Tags</h2>
          <div className='space-y-4'>
            {user.topTags.map((tag, index) => (
              <div key={index} className='tag-container flex items-center gap-4'>
                <div className='w-24'>
                  <span className='tag-name px-2 py-1 rounded-sm'>{tag.name}</span>
                </div>
                <div className='tag-stats'>
                  <div>
                    <div className='stat-value'>{tag.score}</div>
                    <div className='stat-label'>score</div>
                  </div>
                  <div>
                    <div className='stat-value'>{tag.posts}</div>
                    <div className='stat-label'>posts</div>
                  </div>
                  <div>
                    <div className='stat-value'>{tag.points}</div>
                    <div className='stat-label'>points</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
