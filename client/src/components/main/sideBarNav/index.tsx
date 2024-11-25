import React from 'react';
import './index.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import { MessageSquare, Tag, User } from 'lucide-react';
import SideBarLink from './sidebarLink';
import useUserContext from '../../../hooks/useUserContext';

/**
 * The SideBarNav component has two menu items: "Questions" and "Tags".
 * It highlights the currently selected item based on the active page and
 * triggers corresponding functions when the menu items are clicked.
 */

const SideBarNav = () => {
  const { user } = useUserContext(); // Access the user context

  return (
    <div id='sideBarNav' className='sideBarNav'>
      <SideBarLink to='/home' icon={<MessageSquare />} label='Questions' id='menu_questions' />
      <SideBarLink to='/tags' icon={<Tag />} label='Tags' id='menu_tags' />
      <SideBarLink
        to={`/profile/${user.username}`}
        icon={<User />}
        label='Profile'
        id='menu_profile'
      />
    </div>
  );
};
  
export default SideBarNav;
