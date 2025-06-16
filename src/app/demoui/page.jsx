"use client";
import Sidebar from "./sideBar";
import ChatList from "./ChatList";
import RightPanel from "./rightPanel";
import ChatWindow from "./chatWindow";
import { useEffect, useRef, useState } from "react";

const PageRoot = () => {
  const [rightPanelWidth, setRightPanelWidth] = useState(288);
  const [isResizing, setIsResizing] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(true);

  const panelRef = useRef(null);

  const startResize = () => {
    setIsResizing(true);
  };

  const handleMouseMove = (e) => {
    if (!isResizing) return;
    const newWidth = window.innerWidth - e.clientX;
    if (newWidth >= 200 && newWidth <= 400) {
      setRightPanelWidth(newWidth);
    }
  };

  const stopResize = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopResize);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", stopResize);
    };
  }, [isResizing]);

  return (
    <div className="bg-white text-gray-900">
      <div className="flex h-screen max-w-full mx-auto border border-gray-200 rounded-lg overflow-hidden relative">
        <Sidebar />
        <div className="">
          <ChatList />
        </div>
        <ChatWindow />

        {/* Toggle button for mobile */}
        <button
          className="absolute top-4 right-4 z-50 lg:hidden bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
          onClick={() => setShowRightPanel(!showRightPanel)}
        >
          {showRightPanel ? "Hide Info" : "Show Info"}
        </button>

        {/* Right Panel Container */}
        <div
          ref={panelRef}
          style={{ width: showRightPanel ? rightPanelWidth : 0 }}
          className={`transition-all duration-200 ease-in-out ${
            showRightPanel ? "lg:flex" : "lg:hidden"
          } hidden flex-col border-l border-gray-200 bg-white relative`}
        >
          {showRightPanel && <RightPanel />}

          {/* Resize Handle */}
          {showRightPanel && (
            <div
              onMouseDown={startResize}
              className="absolute top-0 left-0 w-1 h-full cursor-ew-resize bg-transparent hover:bg-gray-200"
            ></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageRoot;
