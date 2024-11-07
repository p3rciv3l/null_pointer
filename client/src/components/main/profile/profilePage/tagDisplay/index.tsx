import React from 'react';
import './index.css';

interface TagDisplayProps {
  topTags: { name: string; score: number; points: number }[];
}

const TagDisplay = ({ topTags }: TagDisplayProps) => (
  <div>
    <h2>Top Tags</h2>
    <div className='tags-list'>
      {topTags.map((tag, index) => (
        <div key={index} className='tag-container'>
          <span className='tag-name'>{tag.name}</span>
          <div className='tag-details'>
            <div>
              <span className='stat-value'>{tag.score}</span>
              <span className='stat-label'>score</span>
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
);

export default TagDisplay;
