import React, { useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useParams } from 'react-router-dom';
import './index.css';
import { Tag } from '../../../../types';
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
  const tag1: Tag = {
    _id: '507f191e810c19729de860ea',
    name: 'react',
    description: 'T1_DESC2',
  };

  const tag2: Tag = {
    _id: '65e9a5c2b26199dbcc3e6dc8',
    name: 'javascript',
    description: 'T2_DESC',
  };

  const tag3: Tag = {
    _id: '65e9b4b1766fca9451cba653',
    name: 'android',
    description: 'T3_DESC',
  };

  const user = {
    name: username,
    title: 'Computer Engineer',
    bio: 'Hello, I am a software developer simply trying to learn more on this platform! I specialize in Ubuntu, Information Security, and Software Engineering!',
    reputation: 2918,
    badgesEarned: { gold: 20, silver: 15, bronze: 5 },
    answers: 90,
    questions: 14,
    joinedWhen: new Date(),
    topTags: [
      { name: 'python', score: 29, posts: 35, points: 34 },
      { name: 'php', score: 10, posts: 16, points: 6 },
      { name: 'mysql', score: 4, posts: 4, points: 10 },
    ],
    questionsAnswered: [
      {
        _id: '65e9b58910afe6e94fc6e6dc',
        title: 'Quick question about storage on android',
        tags: [tag2, tag3],
        askDateTime: new Date('2023-11-16T09:24:00'),
      },
      {
        _id: '65e9b5a995b6c7045a30d823',
        title: 'Object storage for a web application',
        tags: [tag1, tag2],
        askDateTime: new Date('2023-11-17T09:24:00'),
      },
      {
        _id: '65e9b9b44c052f0a08ecade0',
        title: 'Is there a language to write programmes by pictures?',
        tags: [],
        askDateTime: new Date('2023-11-19T09:24:00'),
      },
      {
        _id: '65e9b716ff0e892116b2de09',
        title: 'Unanswered Question #2',
        tags: [],
        askDateTime: new Date('2023-11-20T09:24:00'),
      },
    ],
    answersAsked: [
      {
        _id: '65e9b58910afe6e94fc6e6dc',
        text: 'Answer 1 text',
      },
      {
        _id: '65e9b58910afe6e94fc6e6dd',
        text: 'Answer 2 text',
      },
    ],
  };

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
              title={profile.title}
              bio={profile.bio}
              date={formattedDate}
              reputation={user.reputation}
              goldBadge={user.badgesEarned.gold}
              silverBadge={user.badgesEarned.silver}
              bronzeBadge={user.badgesEarned.bronze}
            />
          </ContentCard>

          {/* Stats Card */}
          <StatsCard
            numQuestionsAsked={profile.questionsAsked.length}
            numAnswersGiven={profile.answersGiven.length}
            reputation={user.reputation}
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
          <TagDisplay activeTab={activeTab} topTags={user.topTags} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
