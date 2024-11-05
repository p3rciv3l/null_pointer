import React from 'react';
import { useParams } from 'react-router-dom';
import './index.css';
import { Answer, Tag, Comment, Question} from '../../../../types';

const ProfilePage = () => {
  const { username } = useParams();

  const tag1: Tag = {
    _id: '507f191e810c19729de860ea',
    name: 'react',
    description: 'T1_DESC',
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

  const com1: Comment = {
    text: 'com1',
    commentBy: 'com_by1',
    commentDateTime: new Date('2023-11-18T09:25:00'),
  };

  const ans1: Answer = {
    _id: '65e9b58910afe6e94fc6e6dc',
    text: 'ans1',
    ansBy: 'ansBy1',
    ansDateTime: new Date('2023-11-18T09:24:00'),
    comments: [],
  };

  const ans2: Answer = {
    _id: '65e9b58910afe6e94fc6e6dd',
    text: 'ans2',
    ansBy: 'ansBy2',
    ansDateTime: new Date('2023-11-20T09:24:00'),
    comments: [],
  };

  const ans3: Answer = {
    _id: '65e9b58910afe6e94fc6e6de',
    text: 'ans3',
    ansBy: 'ansBy3',
    ansDateTime: new Date('2023-11-19T09:24:00'),
    comments: [],
  };

  const ans4: Answer = {
    _id: '65e9b58910afe6e94fc6e6df',
    text: 'ans4',
    ansBy: 'ansBy4',
    ansDateTime: new Date('2023-11-19T09:24:00'),
    comments: [],
  };

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const QUESTIONS: Question[] = [
    {
      _id: '65e9b58910afe6e94fc6e6dc',
      title: 'Quick question about storage on android',
      text: 'I would like to know the best way to go about storing an array on an android phone so that even when the app/activity ended the data remains',
      tags: [tag3, tag2],
      answers: [ans1, ans2],
      askedBy: 'q_by1',
      askDateTime: new Date('2023-11-16T09:24:00'),
      views: ['question1_user', 'question2_user'],
      upVotes: [],
      downVotes: [],
      comments: [],
    },
    {
      _id: '65e9b5a995b6c7045a30d823',
      title: 'Object storage for a web application',
      text: 'I am currently working on a website where, roughly 40 million documents and images should be served to its users. I need suggestions on which method is the most suitable for storing content with subject to these requirements.',
      tags: [tag1, tag2],
      answers: [ans1, ans2, ans3],
      askedBy: 'q_by2',
      askDateTime: new Date('2023-11-17T09:24:00'),
      views: ['question2_user'],
      upVotes: [],
      downVotes: [],
      comments: [],
    },
    {
      _id: '65e9b9b44c052f0a08ecade0',
      title: 'Is there a language to write programmes by pictures?',
      text: 'Does something like that exist?',
      tags: [],
      answers: [],
      askedBy: 'q_by3',
      askDateTime: new Date('2023-11-19T09:24:00'),
      views: ['question1_user', 'question2_user', 'question3_user', 'question4_user'],
      upVotes: [],
      downVotes: [],
      comments: [],
    },
    {
      _id: '65e9b716ff0e892116b2de09',
      title: 'Unanswered Question #2',
      text: 'Does something like that exist?',
      tags: [],
      answers: [],
      askedBy: 'q_by4',
      askDateTime: new Date('2023-11-20T09:24:00'),
      views: [],
      upVotes: [],
      downVotes: [],
      comments: [],
    },
  ];
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
    bio: 'Hello, I am a software developer simply trying to learn more on this platform! I specialize in Ubuntu, Information Security, and Software Engineering!',
    reputation: 2918,
    answers: 90,
    questions: 14,
    joinedWhen: Date.now(),
    questionsAsked: QUESTIONS,
    answersGiven: [],
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
