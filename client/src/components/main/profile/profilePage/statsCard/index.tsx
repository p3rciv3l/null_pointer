import React from 'react';
import './index.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import { HelpCircle, MessageSquare, Star } from 'lucide-react';
import { ContentCard } from '../profileComponents';

interface StatsCardProps {
  numQuestionsAsked: number;
  numAnswersGiven: number;
  reputation: number;
}

const StatsCard = ({ numQuestionsAsked, numAnswersGiven, reputation }: StatsCardProps) => (
  <ContentCard>
    <h3 className='stats-title'>Activity Stats</h3>
    <div className='stats-list'>
      <div className='stat-item'>
        <div className='stat-label'>
          <HelpCircle className='w-5 h-5' style={{ color: '#A71F35' }} />
          <span>Questions Posted</span>
        </div>
        <span className='font-bold'>{numQuestionsAsked}</span>
      </div>
      <div className='stat-item'>
        <div className='stat-label'>
          <MessageSquare className='w-5 h-5' style={{ color: '#A71F35' }} />
          <span>Questions Answered</span>
        </div>
        <span className='font-bold'>{numAnswersGiven}</span>
      </div>
      <div className='stat-item'>
        <div className='stat-label'>
          <Star className='w-5 h-5' style={{ color: '#A71F35' }} />
          <span>Total Reputation</span>
        </div>
        <span className='font-bold'>{reputation}</span>
      </div>
    </div>
  </ContentCard>
);
export default StatsCard;
