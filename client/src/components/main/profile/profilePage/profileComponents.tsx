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
}

export const ContentCard: React.FC<ContentCardProps> = ({ children, className = '' }) => (
  <div className={`content-card ${className}`}>{children}</div>
);
