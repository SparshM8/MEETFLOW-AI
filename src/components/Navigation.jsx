import React, { useContext, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Sparkles, LayoutDashboard, CalendarDays, UserRound, X, Compass, LogOut } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import './Navigation.css';

const Navigation = () => {
  const { currentUser, isSidebarOpen, setIsSidebarOpen, logOut } = useContext(AppContext);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) setIsSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsSidebarOpen]);

  const close = () => setIsSidebarOpen(false);

  return (
    <>
      <div className={`sidebar-backdrop ${isSidebarOpen ? 'active' : ''}`} onClick={close}></div>

      <nav className={`side-nav ${isSidebarOpen ? 'open' : ''}`}>
        {/* Brand */}
        <div className="nav-brand">
          <div className="flex items-center gap-3">
            <Sparkles className="brand-icon" size={24} />
            <span className="brand-text gradient-text-accent">MeetFlow AI</span>
          </div>
          <button className="mobile-close-btn" onClick={close}>
            <X size={22} className="text-secondary" />
          </button>
        </div>

        {/* Links */}
        <div className="nav-links">
          <NavLink to="/dashboard" onClick={close} className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/explore" onClick={close} className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
            <Compass size={19} />
            <span>Explore People</span>
          </NavLink>
          <NavLink to="/agenda" onClick={close} className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
            <CalendarDays size={19} />
            <span>My Agenda</span>
          </NavLink>
        </div>

        {/* Footer / Profile */}
        <div className="nav-footer">
          <NavLink to="/profile" onClick={close} className={({ isActive }) => 'nav-item user-profile' + (isActive ? ' active' : '')}>
            <div className="nav-avatar">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : <UserRound size={16} />}
            </div>
            <div className="nav-user-info">
              <span className="nav-user-name">{currentUser?.name || 'My Profile'}</span>
              <span className="nav-user-role text-xs text-tertiary">{currentUser?.role || 'View profile'}</span>
            </div>
          </NavLink>
          
          <button className="nav-item nav-logout mt-2" onClick={logOut}>
            <LogOut size={19} />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
