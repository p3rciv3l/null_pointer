import React, { useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useParams } from 'react-router-dom';
import './index.css';
import useViewProfile from '../../../../hooks/useViewProfile';
import { ContentCard, TabButton } from './profileComponents';
import ProfileCard from './profileHeader';
import StatsCard from './statsCard';
import QuestionDisplay from './questionDisplay';
import AnswerDisplay from './answerDisplay';
import TagDisplay from './tagDisplay';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('questions');
  const { username } = useParams();

  const { profile } = useViewProfile(username);
  if (!profile) return <div>Profile not found</div>;

  const formattedDate = new Date(profile.joinedWhen).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className='profile-page'>
      <div className='profile-grid'>
        {/* Left Column */}
        <div>
          {/* Profile Card */}
          <ContentCard>
            <ProfileCard
              username={username}
              title={profile.title?.trim() ? profile.title : 'No title added'}
              bio={profile.bio?.trim() ? profile.bio : 'No bio added'}
              date={formattedDate}
              reputation={profile?.reputation ?? 0}
              goldBadge={profile.badgeCount?.gold ?? -500}
              silverBadge={profile.badgeCount?.silver ?? -500}
              bronzeBadge={profile.badgeCount?.bronze ?? -500}
            />
          </ContentCard>

          {/* Stats Card */}
          <StatsCard
            numQuestionsAsked={profile.questionsAsked.length}
            numAnswersGiven={profile.answersGiven.length}
            reputation={profile?.reputation ?? 0}
          />
        </div>

        {/* Right Column */}
        <div>
          <div className='tabs-container'>
            <TabButton
              label='Questions'
              tab='questions'
              activeTab={activeTab}
              onClick={setActiveTab}
            />
            <TabButton label='Answers' tab='answers' activeTab={activeTab} onClick={setActiveTab} />
            <TabButton label='Top Tags' tab='tags' activeTab={activeTab} onClick={setActiveTab} />
          </div>

          <QuestionDisplay activeTab={activeTab} questionsPosted={profile.questionsAsked} />
          <AnswerDisplay activeTab={activeTab} answersGiven={profile.answersGiven} />
          <TagDisplay activeTab={activeTab} topTags={profile.topTags || []} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
