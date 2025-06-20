"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  faBolt,
  faUser,
  faCommentAlt,
  faCog,
  faQuestionCircle,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Sidebar({ onChatsClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const navItems = [
    { icon: faUser, label: 'Profile' },
    { icon: faCommentAlt, label: 'Chats' },
    { icon: faCog, label: 'Settings' },
    { icon: faQuestionCircle, label: 'Help' },
    { icon: faSignOutAlt, label: 'Logout' },
  ];

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('chat');
    router.push('/authorization/login');
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="fixed md:hidden top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FontAwesomeIcon icon={faBolt} />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-20 bg-gradient-to-b from-violet-700/80 to-blue-900/80 backdrop-blur-lg shadow-2xl border-r border-white/10 transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center w-16 h-16 mx-auto mt-6 mb-8 rounded-2xl bg-white shadow-lg hover:scale-110 transform transition-transform duration-300">
          <FontAwesomeIcon icon={faBolt} className="text-blue-600 text-2xl" />
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-6 mt-4 px-2">
          {navItems.map((item, idx) => (
            <button
              key={idx}
              className="group relative flex items-center justify-center w-12 h-12 mx-auto rounded-xl transition-all duration-300 hover:bg-white/20 hover:backdrop-blur-sm hover:scale-110"
              title={item.label}
              onClick={
                item.label === 'Logout'
                  ? logout
                  : item.label === 'Chats'
                    ? () => { if (onChatsClick) onChatsClick(); }
                    : undefined
              }
            >
              <FontAwesomeIcon
                icon={item.icon}
                className="text-white text-lg group-hover:text-blue-200 transition-colors duration-300"
              />
              {/* Tooltip */}
              <span className="absolute left-full ml-3 px-3 py-1 bg-white/10 backdrop-blur text-black text-xs rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50 hidden lg:block">
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        {/* Spacer */} 
        <div className="flex-1 p-1.5"></div>

        {/* User Status */}
        <div className="px-2 pb-14">
          <div className="w-12 h-12 mx-auto rounded-xl bg-white/10 flex items-center justify-center shadow-inner relative">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-ping absolute"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>
      </aside>
    </>
  );
}
