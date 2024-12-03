import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './index.css';
import { Search } from 'lucide-react';
import useHeader from '../../hooks/useHeader';
import { useDropdown } from '../../hooks/useDropdown';
import AskQuestionButton from '../main/askQuestionButton';
import { logout } from '../../services/authService';
import NotificationBell from '../main/notificationBell';
import UserProfileLink from '../main/profile/profileLink';

/**
 * Header component that renders the main title and a search bar.
 * The search bar allows the user to input a query and navigate to the search results page
 * when they press Enter.
 */

const Header = () => {
  const { val, handleInputChange, handleKeyDown, user } = useHeader();
  const navigate = useNavigate();
  const { isOpen, handlers } = useDropdown();

  const handleSignOut = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className='header'>
      <div className='header-container'>
        {/* Left Section */}
        <div className='center-section'>
          <Link to='/home'>
            <img src='/assets/alternate_full_logo_1.png' alt='Logo' className='logo' />
          </Link>
          <div className='search-container'>
            <div className='search-wrapper'>
              <Search className='search-icon' />
              <input
                type='search'
                placeholder='Find a Question...'
                className='search-input'
                value={val}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
        </div>
        {/* Right Section */}
        <div className='right-section'>
          <AskQuestionButton />
          <NotificationBell />
          <div
            className='user-section'
            onMouseEnter={handlers.handleMouseEnter}
            onMouseLeave={handlers.handleMouseLeave}>
            <div className='user-avatar' onClick={handlers.handleClick}>
              <span>{user.username.charAt(0).toUpperCase()}</span>
            </div>
            {isOpen && (
              <div className='dropdown-content'>
                <div className='dropdown-item'>
                  <UserProfileLink username={user.username} isIconPage={true} />
                </div>
                <div
                  className='dropdown-item'
                  onClick={handleSignOut}
                  role='button'
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && handleSignOut()}>
                  Sign Out
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
