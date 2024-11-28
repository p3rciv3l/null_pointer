import React, { ReactNode } from 'react';

interface TabButtonProps {
  label: string;
  tab: string;
  activeTab: string;
  onClick: (tab: string) => void;
}

export const TabButton: React.FC<TabButtonProps> = ({ label, tab, activeTab, onClick }) => (
  <button onClick={() => onClick(tab)} className='tab-button' data-active={activeTab === tab}>
    {label}
  </button>
);

interface ContentCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void; // Optional onClick handler
}

export const ContentCard: React.FC<ContentCardProps> = ({ children, className = '', onClick }) => (
  <div className={`content-card ${className}`} onClick={onClick}>
    {' '}
    {children}
  </div>
);
