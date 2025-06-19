"use client";
import React, { useEffect } from "react";
import { fetchChatList } from '@/app/service/ChatListService';

const USER_ID = "64ee176b-ef44-4c42-937d-aba39ed0d253"

export default function ChatList({selectRoomId}) {
  const [search, setSearch] = React.useState("");
  const [chatList, setChatList] = React.useState([]);
  const [chatData, setChatData] = React.useState([])
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch chat list data
  const fetchData = async () => {
    try {
      const data = await fetchChatList(USER_ID);
      setChatData(data);
      setChatList(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const onclickSelectRoom = (chat) => {
    selectRoomId(chat);
    console.log("Selected room ID:", chat);
  };

const filterChatList = (searchValue) => {
  const lowerSearch = searchValue.toLowerCase();
  setChatList(
    chatData.filter(chat =>
      chat.username.toLowerCase().includes(lowerSearch)
    )
  );
};


  return (
    <div className="hidden md:flex ml-[80px] w-80 flex-col border-r border-gray-200 bg-gradient-to-b from-white to-gray-50 shadow-lg">
      <section className="flex flex-col w-full h-full px-2 py-4 ">
        {/* User Info */}
        <div className="flex items-center space-x-3 sm:space-x-2 mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-sm">
          <div className="relative">
            <img
              className="rounded-full ring-4 ring-white shadow-lg"
              src="https://storage.googleapis.com/a1aa/image/e15f9630-bf6e-41b6-90e8-2df7a4517e02.jpg"
              width="40"
              height="40"
              alt="Rohmad Khoir"
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-gray-800 truncate">Rohmad Khoir</p>
            <p className="text-xs text-gray-500">Online</p>
          </div>
        </div>

        {/* Online Users */}
        <div className="mb-6 sm:mb-8">
          <p className="text-sm font-bold mb-3 sm:mb-4 text-gray-700 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Online now
          </p>
          <div className="flex items-center space-x-2 sm:space-x-3">
            {[
              "4cf23f41-8a5f-4d21-7197-c7ae87377368",
              "a0773811-3e87-4fcc-ea3b-8d900e8daf49",
              "942f765a-82e3-45f5-467d-6af82467557f",
              "4b748e32-024c-4824-9c3c-60206204ddc3",
            ].map((id, i) => (
              <div key={i} className="relative">
                <img
                  className="rounded-full border-3 border-white shadow-md hover:scale-110 transition-transform duration-200"
                  src={`https://storage.googleapis.com/a1aa/image/${id}.jpg`}
                  width="32"
                  height="32"
                  alt={`User ${i + 1}`}
                />
                <div className="absolute -bottom-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
            ))}
            <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold shadow-md hover:scale-110 transition-transform duration-200" title="+6 more">
              +6
            </div>
          </div>
        </div>

        {/* Messages Section */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <p className="text-sm font-bold text-gray-700">Messages</p>
          <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        {/* Search */}
        <div className="mb-4 sm:mb-6 relative">
          <input
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 text-sm text-gray-700 pl-8 sm:pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => {
            const value = e.target.value;
            setSearch(value);
            filterChatList(value);
            }}
          />
          <svg className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Chat List */}
        <ul className="flex flex-col space-y-2 sm:space-y-3 h-96 overflow-y-auto scrollbar-thin scrollbar-hide" style={{ maxHeight: "500px" }}>
          {/* Sample Message */}
          <li className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 cursor-pointer group">
            <div className="relative">
              <img
                className="rounded-full ring-2 ring-white shadow-sm group-hover:ring-blue-200 transition-all duration-200"
                src="https://storage.googleapis.com/a1aa/image/44c5dedb-c60c-47f5-04c5-d3cd4b60e8da.jpg"
                width="36"
                height="36"
                alt="Suneo"
              />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">Suneo Marinir</p>
              <p className="text-xs text-blue-600 font-medium">Suneo is typing...</p>
            </div>
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm">
              2
            </div>
          </li>

          {/* Additional sample chats */}
          {chatList.map((chat) => (
            <li
              key={chat.room_id}
              onClick={() => onclickSelectRoom(chat)}
              className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-200 cursor-pointer group"
            >
              <div className="relative">
                {chat.img_url ? (
                  // Hiển thị ảnh đại diện nếu có
                  <img
                    src={chat.img_url}
                    alt={chat.username}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                  />
                ) : (
                  // Nếu không có ảnh, hiển thị chữ cái đầu username
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {chat.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold text-gray-800 truncate">{chat.username}</p>
                  <p className="text-xs text-gray-400">{chat.time || "No time available"}</p>
                </div>
                <p className="text-xs text-gray-500 truncate">{chat.status || "No status available"}</p>
              </div>
              {chat.unread > 0 && (
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm">
                  {chat.unread || 0}
                </div>
              )}
            </li>
          ))}

        </ul>
      </section>
    </div>
  );
}
