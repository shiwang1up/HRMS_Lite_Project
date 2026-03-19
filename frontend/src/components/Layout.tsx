import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Users, CalendarCheck, Home, Menu, X } from 'lucide-react';

const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-primary-100 selection:text-primary-900">
      
      {/* Mobile Top Navbar */}
      <div className="lg:hidden fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 z-30 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5 text-primary-600 font-bold text-lg">
          <div className="bg-gradient-to-br from-primary-500 to-indigo-600 p-1.5 rounded-lg text-white shadow-sm">
            <Home size={18} strokeWidth={2.5} />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 tracking-tight">HRMS Lite</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(true)} 
          className="p-2 -mr-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <aside className="relative w-72 max-w-[80vw] bg-white h-full flex flex-col p-6 shadow-2xl animate-in slide-in-from-left duration-300">
            <button 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-3 text-primary-600 font-bold text-2xl pb-8 mb-2 border-b border-slate-100 mt-2">
              <div className="bg-gradient-to-br from-primary-500 to-indigo-600 p-2 rounded-xl text-white shadow-md shadow-primary-500/20">
                <Home size={22} strokeWidth={2.5} />
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 tracking-tight">HRMS Lite</span>
            </div>
            
            <nav className="flex flex-col gap-2 flex-1 mt-6">
              <NavLink 
                to="/employees" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => `group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive ? 'bg-primary-50 text-primary-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                {({ isActive }) => (
                  <>
                    <Users size={20} className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                    <span>Employees</span>
                  </>
                )}
              </NavLink>
              
              <NavLink 
                to="/attendance" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => `group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive ? 'bg-primary-50 text-primary-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                {({ isActive }) => (
                  <>
                    <CalendarCheck size={20} className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                    <span>Attendance</span>
                  </>
                )}
              </NavLink>
            </nav>
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col p-6 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 transition-all duration-300">
        <div className="flex items-center gap-3 text-primary-600 font-bold text-2xl pb-8 mb-2 border-b border-slate-100">
          <div className="bg-gradient-to-br from-primary-500 to-indigo-600 p-2 rounded-xl text-white shadow-md shadow-primary-500/20">
            <Home size={22} strokeWidth={2.5} />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 tracking-tight">HRMS Lite</span>
        </div>
        
        <nav className="flex flex-col gap-2 flex-1 mt-6">
          <NavLink 
            to="/employees" 
            className={({ isActive }) => `group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive ? 'bg-primary-50 text-primary-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            {({ isActive }) => (
              <>
                <Users size={20} className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span>Employees</span>
              </>
            )}
          </NavLink>
          
          <NavLink 
            to="/attendance" 
            className={({ isActive }) => `group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive ? 'bg-primary-50 text-primary-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            {({ isActive }) => (
              <>
                <CalendarCheck size={20} className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span>Attendance</span>
              </>
            )}
          </NavLink>
        </nav>
      </aside>
      
      {/* Main Content Area */}
      <main className="flex-1 w-full lg:w-auto p-4 sm:p-8 lg:p-12 mt-[60px] lg:mt-0 overflow-y-auto overflow-x-hidden bg-[radial-gradient(#cbd5e1_1px,transparent_0)] [background-size:32px_32px]">
        <div className="max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
