import React from 'react';
import './index.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ContentCard } from '../profileComponents';

interface TagDisplayProps {
  activeTab: string;
  topTags: { name: string; score: number; posts: number; points: number }[];
}

const TagDisplay = ({ activeTab = ' ', topTags = [] }: TagDisplayProps) => {
  console.log('Top Tags:', topTags); // Logs the topTags argument to the console

  return (
    <>
      {activeTab === 'tags' && (
        <ContentCard>
          <h3 className='stats-title'>Top Tags</h3>
          <div className='top-tags-container'>
            {topTags.map(tag => (
              <div key={tag.name} className='tag-item'>
                <span className='tag'>{tag.name}</span>
                <div className='tag-metrics'>
                  <span>{tag.score} score</span>
                  <span>{tag.posts} posts</span>
                  <span>{tag.points} points</span>
                </div>
              </div>
            ))}
          </div>
        </ContentCard>
      )}
    </>
  );
};

export default TagDisplay;
