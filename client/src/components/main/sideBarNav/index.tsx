import React from 'react';
import './index.css';
import { NavLink } from 'react-router-dom';
import useTagPage from '../../../hooks/useTagPage';

/**
 * The SideBarNav component has two menu items: "Questions" and "Tags".
 * It highlights the currently selected item based on the active page and
 * triggers corresponding functions when the menu items are clicked.
 */
const SideBarNav = () => {
  const { tlist, clickTag } = useTagPage();

  return (
    <div id='sideBarNav' className='sideBarNav'>
      <h2 className='sidebar-title'>Tags</h2>
      <ul className='tag-list'>
        {tlist.map((t, idx) => (
          <li key={idx} className='tag-item' onClick={() => clickTag(t.name)}>
            {t.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideBarNav;
