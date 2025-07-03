'use client';
import { useState } from "react";
import { FaUserPlus, FaEnvelope, FaUsers, FaUserFriends, FaUserCheck } from "react-icons/fa";
import SideBar from "@/app/home/sideBar";

const users = [
  {
    user_id: "3f63c445-b361-41b9-b757-4b5991422b60",
    username: "nguyetha",
    email: "nguyetha@example.com",
    phone: "0986755403",
    img_url: "https://scontent.fsgn8-4.fna.fbcdn.net/v/t39.30808-1/448159951_3275047269470063_6453157297673258796_n.jpg?...",
    display_name: "Le Nguyet Ha",
    created_at: "2025-06-19T08:58:46",
    role: {
      role_id: "1d7d9c13-476f-490c-9302-546a606c567b",
      role_name: "MODERATOR",
      create_time: "2025-06-14T14:12:01"
    },
    flagDelete: 1
  },
  // Add more users as needed
];

const TABS = [
  { label: "Lời mời kết bạn", key: "requests", icon: <FaUserCheck /> },
  { label: "Bạn bè", key: "friends", icon: <FaUserFriends /> },
  { label: "Gợi ý", key: "suggestions", icon: <FaUsers /> }
];

export default function UserListPage() {
  const [activeTab, setActiveTab] = useState("suggestions");
  const [added, setAdded] = useState({});
  const [messaged, setMessaged] = useState({});

  const handleAddFriend = (id) => {
    setAdded(prev => ({ ...prev, [id]: true }));
  };
  const handleMessage = (id) => {
    setMessaged(prev => ({ ...prev, [id]: true }));
    setTimeout(() => setMessaged(prev => ({ ...prev, [id]: false })), 1200);
  };

  return (
    <>
      <SideBar />
      <div className="min-h-screen bg-gradient-to-tr from-blue-50 to-pink-50 flex flex-col items-center py-10 px-4">
        <div className="w-full max-w-4xl">
          {/* Search */}
          <div className="relative mb-6">
            <input
              type="text"
              className="w-full rounded-full border border-gray-300 bg-white pl-12 pr-4 py-3 text-sm text-gray-800 shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tìm kiếm bạn bè..."
            />
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-8">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow transition-all duration-200
                  ${activeTab === tab.key ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="space-y-6">
            {users.map((user) => (
              <div
                key={user.user_id}
                className="flex items-center bg-white rounded-2xl shadow-md p-4 gap-4 hover:shadow-lg transition-all duration-300 group"
              >
                <img
                  src={user.img_url}
                  alt={user.display_name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-200 group-hover:scale-105 transition-transform duration-300"
                />

                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-base text-gray-900">{user.display_name}</div>
                  <div className="text-sm text-gray-600">@{user.username}</div>
                  <div className="text-xs text-gray-400">{user.email}</div>
                  <div className="text-xs text-blue-500 font-medium mt-1">{user.role?.role_name}</div>
                </div>

                <div className="flex flex-col gap-2 min-w-[120px]">
                  <button
                    onClick={() => handleAddFriend(user.user_id)}
                    disabled={added[user.user_id]}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full font-medium text-sm shadow
                      ${added[user.user_id] ? 'bg-gray-100 text-green-600 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'}`}
                  >
                    <FaUserPlus /> {added[user.user_id] ? "Đã gửi" : "Kết bạn"}
                  </button>

                  <button
                    onClick={() => handleMessage(user.user_id)}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full font-medium text-sm shadow bg-pink-500 text-white hover:bg-pink-600 active:scale-95 ${messaged[user.user_id] ? 'animate-pulse' : ''}`}
                  >
                    <FaEnvelope /> {messaged[user.user_id] ? "Đã gửi!" : "Nhắn tin"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}