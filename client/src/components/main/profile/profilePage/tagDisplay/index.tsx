import React from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ThumbsUp, Clock } from 'lucide-react';
import { Question, Comment, Tag } from '../../../../../types';
import { ContentCard } from '../profileComponents';

interface TagDisplayProps {
  activeTab: string;
  topTags: { name: string; score: number; posts: number; points: number }[];
}

const TagDisplay = ({ activeTab = ' ', topTags = [] }: TagDisplayProps) => (
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

export default TagDisplay;
