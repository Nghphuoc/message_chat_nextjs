'use client';
import { useMediaQuery } from 'react-responsive';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import Sidebar from './sideBar';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import RightPanel from './rightPanel';
//import UserDetail from './UserDetail';
import "../globals.css";

const PageRoot = () => {
  const [rightPanelWidth, setRightPanelWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);
  const [roomSelectAtChatList, setRoomSelectAtChatList] = useState(null);
  const [checkedListChat, setCheckedListChat] = useState(true);
  const [user, setUser] = useState(null);
  const [userChecked, setUserChecked] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const isMobile = useMediaQuery({ maxWidth: 767 })

  // Load user from sessionStorage
  const loadUser = useCallback(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Error parsing user data:", err);
        sessionStorage.removeItem('user');
      }
    }
    setUserChecked(true);
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (userChecked && !user) {
      router.push('/authorization/login');
    }
  }, [user, userChecked, router]);

  // Handle Resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return;

      const containerRight = containerRef.current.getBoundingClientRect().right;
      const newWidth = containerRight - e.clientX;

      if (newWidth >= 240 && newWidth <= 480) {
        setRightPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => setIsResizing(false);

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  if (!userChecked) {
    return (
      <div className="flex items-center text-center justify-center h-screen bg-gradient-to-r from-sky-100 to-blue-200 text-gray-600">
        Loading user...
      </div>
    );
  }

  return (
    <>
      <div className="flex h-screen overflow-hidden bg-gradient-to-tr from-sky-50 to-blue-100">
        {/* Sidebar */}
        <div className="flex flex-shrink-0 h-screen border-r border-gray-200 bg-white shadow-sm">
          <Sidebar chatGroup={() => setCheckedListChat(true)}  />
        </div>

        {/* Main Container */}
        <div className="flex flex-1 flex-col md:flex-row" ref={containerRef}>

          {checkedListChat && (
            <div className=" md:ml-[80px] flex flex-shrink-0 h-screen border-r border-gray-200 bg-white transition-all duration-300 ease-in-out transform tracking-widest transform-fill">
              {/* <div onClick={() => {if (isMobile) setCheckedListChat(prev => !prev)}}> */}
              <ChatList selectRoomId={setRoomSelectAtChatList} isOpenSideBar={() => {if (isMobile) setCheckedListChat(false)}}/>
              </div>
            // </div>
          )}

          {/* Chat Window */}
          {checkedListChat ? (<div className="hidden md:flex flex-1 flex-col relative bg-white min-h-screen overflow-hidden ">
            <ChatWindow
              onMenuClick={() => setCheckedListChat(!checkedListChat)}
              onChatListClick={() => setRoomSelectAtChatList(null)}
              chat={roomSelectAtChatList}
            />

            {/* Resize Handle */}
            <div
              onMouseDown={() => setIsResizing(true)}
              className="hidden lg:block absolute top-0 right-0 h-full w-2 cursor-col-resize z-20"
            >
            </div>
          </div>) : (<div className={`${(!isMobile) ? "ml-[80px]" : ""}  flex flex-1 flex-col relative bg-white min-h-screen overflow-hidden`}>
            <ChatWindow
              onMenuClick={() => setCheckedListChat(!checkedListChat)}
              onChatListClick={() => setRoomSelectAtChatList(null)}
              chat={roomSelectAtChatList}
            />

            {/* Resize Handle */}
            <div
              onMouseDown={() => setIsResizing(true)}
              className="hidden lg:block absolute top-0 right-0 h-full w-2 cursor-col-resize z-20"
            >
            </div>
          </div>)}

          {/* Right Panel */}
          <div
            className={clsx(
              'hidden lg:flex flex-shrink-0 h-screen border-l border-gray-200 bg-white',
              !isResizing && 'transition-all duration-300 ease-in-out'
            )}
            style={{ width: `${rightPanelWidth}px` }}
          >
            <RightPanel />
          </div>
          
        </div>
      </div>
    </>
  );
};

export default PageRoot;
