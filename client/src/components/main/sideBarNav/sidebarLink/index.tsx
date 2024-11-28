import { NavLink } from 'react-router-dom';
import './index.css';

interface SidebarLinkProps {
  to: string; // The route the link points to
  id: string; // The id of the link
  icon: React.ReactNode; // The icon component
  label: string; // The text label for the link
}

const SideBarLink = ({ to, id, icon, label }: SidebarLinkProps) => (
  <NavLink
    to={to}
    id={id}
    className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
    {icon}
    <span>{label}</span>
  </NavLink>
);
export default SideBarLink;
