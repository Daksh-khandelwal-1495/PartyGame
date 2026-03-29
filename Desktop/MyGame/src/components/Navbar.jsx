import { NavLink } from 'react-router-dom';
import { Home, Layers, Plus, Trophy, Settings } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/decks', icon: Layers, label: 'Decks' },
  { to: '/create', icon: Plus, label: 'Create' },
  { to: '/achievements', icon: Trophy, label: 'Awards' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Navbar() {
  return (
    <nav className="navbar">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
        >
          <Icon className="nav-icon" size={22} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
