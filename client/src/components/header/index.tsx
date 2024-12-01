import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Search, Menu } from 'lucide-react';
import useHeader from '../../hooks/useHeader';
import AskQuestionButton from '../main/askQuestionButton';
import { logout } from '../../services/authService';

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
          <img src='/logo.svg' alt='Logo' className='logo' />
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
          <div className='user-section'>
            <div className='user-avatar'>
              <span>{user.username.charAt(0)}</span>
            </div>
            <Menu className='menu-icon' />
            <button
              className='auth-button'
              style={{ backgroundColor: '#a71f35' }}
              onClick={handleSignOut}>
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
