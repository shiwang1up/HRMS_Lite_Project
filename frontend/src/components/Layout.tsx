import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Users, CalendarCheck, Home } from 'lucide-react';

const Layout: React.FC = () => {
  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <Home size={28} />
          <span>HRMS Lite</span>
        </div>
        
        <nav className="nav-menu">
          <NavLink 
            to="/employees" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Users size={20} />
            <span>Employees</span>
          </NavLink>
          
          <NavLink 
            to="/attendance" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <CalendarCheck size={20} />
            <span>Attendance</span>
          </NavLink>
        </nav>
      </aside>
      
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
