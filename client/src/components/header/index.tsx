import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './index.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Search, Menu } from 'lucide-react';
import useHeader from '../../hooks/useHeader';
import AskQuestionButton from '../main/askQuestionButton';
import { logout } from '../../services/authService';
import NotificationBell from '../main/notificationBell';

/**
 * Header component that renders the main title and a search bar.
 * The search bar allows the user to input a query and navigate to the search results page
 * when they press Enter.
 */

const Header = () => {
  const { val, handleInputChange, handleKeyDown, user } = useHeader();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
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
          <div className='user-section'>
            <div className='user-avatar'>
              <span>{user.username.charAt(0).toUpperCase()}</span>
            </div>
            <Menu className='menu-icon' />
            <div className='dropdown'>
              <div className='dropdown-content'>
                <a href={`/profile/${user.username}`} className='dropdown-item'>
                  Profile
                </a>
                <div
                  className='dropdown-item'
                  onClick={handleSignOut}
                  role='button'
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && handleSignOut()}>
                  Sign Out
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
