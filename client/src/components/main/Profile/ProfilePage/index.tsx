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
    questionsAnswered: [
      {
        _id: '65e9b58910afe6e94fc6e6dc',
        title: 'Quick question about storage on android',
        tags: ['android', 'javascript'],
        askDateTime: new Date('2023-11-16T09:24:00'),
      },
      {
        _id: '65e9b5a995b6c7045a30d823',
        title: 'Object storage for a web application',
        tags: ['react', 'javascript'],
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

  const formattedDate = user.joinedWhen.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className='profile-page'>
      <div className='profile-header'>
        <div className='profile-info'>
          <div className='profile-header-main'>
            <h1>{user.name}</h1>
            <button className='follow-button'>Follow</button>
          </div>
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

        {/* Stats Section */}
        <div className='profile-stats-section'>
          <h2>Stats</h2>
          <div className='stats-item'>
            <strong>Reputation Score:</strong> {user.reputation}
          </div>
          <div className='stats-item'>
            <strong>Questions Answered:</strong> {user.questionsAnswered.length}
          </div>
          <div className='stats-item'>
            <strong>Answers Given:</strong> {user.answersAsked.length}
          </div>
        </div>

        {/* Questions Section */}
        <div className='profile-questions-section'>
          <h2>Questions Asked</h2>
          {user.questionsAnswered.map(question => (
            <div key={question._id} className='question-item'>
              <h3 className='question-title'>{question.title}</h3>
              <div className='question-tags'>
                {question.tags.map((tag, index) => (
                  <span key={index} className='question-tag'>
                    {tag}
                  </span>
                ))}
              </div>
              <p className='question-date'>
                Asked on:{' '}
                {question.askDateTime.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
