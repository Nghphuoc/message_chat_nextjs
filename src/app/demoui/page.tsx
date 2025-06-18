'use client';
import Sidebar from './sideBar';
import ChatList from './ChatList';
import ChatWindow from './chatWindow';
import RightPanel from './rightPanel';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import "../globals.css"; // Import global styles

const PageRoot = () => {
  const [rightPanelWidth, setRightPanelWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);
  const [roomSelectAtChatList, setRoomSelectAtChatList] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return;

      const containerRight = containerRef.current.getBoundingClientRect().right;
      const newWidth = containerRight - e.clientX;

      if (newWidth >= 200 && newWidth <= 500) {
        setRightPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div className="flex h-screen bg-gradient-to-tr from-sky-50 to-blue-100 overflow-hidden">

      <div className="flex-shrink-0 hidden md:flex h-screen border-r border-gray-200 bg-white">
        <Sidebar />
      </div>

      <div className="flex flex-1 flex-col md:flex-row" ref={containerRef}>

        <div className="hidden md:flex w-[400px] flex-shrink-0 h-screen border-r border-gray-200 bg-white">
          <ChatList selectRoomId={setRoomSelectAtChatList} />
        </div>

        <div className="flex flex-1 flex-col relative min-h-screen bg-white">
          <ChatWindow onMenuClick={undefined} onChatListClick={undefined} chat={roomSelectAtChatList} />

          {/* column edit size */}
          <div
            onMouseDown={() => setIsResizing(true)}
            className="hidden lg:block absolute top-0 right-0 h-full w-1 cursor-col-resize bg-gray-300 hover:bg-blue-200 transition-colors duration-200 z-10"
          />
        </div>

        {/* Right Panel - controlled transition */}
        <div
          className={clsx(
            'hidden lg:flex flex-shrink-0 h-screen bg-white border-l border-gray-200',
            !isResizing && 'transition-all duration-300 ease-in-out'
          )}
          style={{ width: `${rightPanelWidth}px` }}
        >
          <RightPanel />
        </div>
      </div>
    </div>
  );
};

export default PageRoot;
