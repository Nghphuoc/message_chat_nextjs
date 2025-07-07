"use client";
import { useEffect, useState } from "react";
import { FaUserPlus, FaEnvelope, FaUsers, FaUserFriends, FaUserCheck } from "react-icons/fa";


const Friend = ({ users, addUser }) => {
    const [activeTab, setActiveTab] = useState("WAIT");
    const [added, setAdded] = useState({});
    const [messaged, setMessaged] = useState({});
    const [userList, setUserList] = useState(users.filter(user => user.status === "WAIT"));
    const [search, setSearch] = useState("");

    useEffect(() => {
        let filtered = users.filter(user => user.status === activeTab);
        if (search.trim() !== "") {
            const searchLower = search.toLowerCase();
            filtered = filtered.filter(user =>
                user.user.display_name.toLowerCase().includes(searchLower) ||
                user.user.username.toLowerCase().includes(searchLower)
            );
        }
        setUserList(filtered);
    }, [users, activeTab, search]);
    
    const handleAddFriend = (id) => {
        setAdded(prev => ({ ...prev, [id]: true }));
        addUser(id);
    };
    const handleMessage = (id) => {
        setMessaged(prev => ({ ...prev, [id]: true }));
        setTimeout(() => setMessaged(prev => ({ ...prev, [id]: false })), 1200);
    };

    const TABS = [
        { label: "Lời mời kết bạn", key: "WAIT", icon: <FaUserCheck /> },
        { label: "Bạn bè", key: "ACCEPTED", icon: <FaUserFriends /> },
        { label: "Đã gửi", key: "sent", icon: <FaUsers /> },
        { label: "Gợi ý", key: "suggestions", icon: <FaUsers /> },
    ];

    const handleCheckActiveTab = (tabKey) => {
        let filteredUsers;
        if (tabKey === "sent") {
            filteredUsers = users.filter(user => user.status !== "WAIT" && user.status !== "ACCEPTED");
        } else {
            filteredUsers = users.filter(user => user.status === tabKey);
        }
        setUserList(filteredUsers);
        setActiveTab(tabKey);
    };

    return (
        <>
            <div className="min-h-screen bg-gradient-to-tr from-blue-50 to-pink-50 flex flex-col items-center py-6 px-2 sm:py-10 sm:px-4">
                <div className="w-full max-w-4xl">
                    {/* Search */}
                    <div className="relative mb-4 sm:mb-6">
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full rounded-full border border-gray-300 bg-white pl-12 pr-4 py-2 sm:py-3 text-sm sm:text-base text-gray-800 shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Tìm kiếm bạn bè..."
                        />
                        <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    {/* Tabs */}
                    <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
                        {TABS.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => handleCheckActiveTab(tab.key)}
                                className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium shadow transition-all duration-200
                                ${activeTab === tab.key ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* List */}
                    <div className="space-y-4 sm:space-y-6">
                        {userList.length === 0 && (
                            <div className="text-center text-gray-400 text-sm py-8">Không tìm thấy bạn bè nào.</div>
                        )}
                        {userList.map((user) => (
                            <div
                                key={user.user.user_id}
                                className="flex flex-col sm:flex-row items-center bg-white rounded-2xl shadow-md p-3 sm:p-4 gap-3 sm:gap-4 hover:shadow-lg transition-all duration-300 group"
                            >
                                <img
                                    src={user.user.img_url}
                                    alt={user.display_name}
                                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-blue-200 group-hover:scale-105 transition-transform duration-300"
                                />

                                <div className="flex-1 min-w-0 text-center sm:text-left">
                                    <div className="font-semibold text-sm sm:text-base text-gray-900">{user.user.display_name}</div>
                                    <div className="text-xs sm:text-sm text-gray-600">@{user.user.username}</div>
                                    <div className="text-xs text-gray-400">{user.user.email}</div>
                                    <div className="text-xs text-blue-500 font-medium mt-1">{user.user.role?.role_name}</div>
                                </div>

                                <div className="flex flex-row sm:flex-col gap-2 min-w-[120px] justify-center sm:justify-start">
                                    <button
                                        onClick={() => handleAddFriend(user.user.user_id)}
                                        disabled={added[user.user.user_id]}
                                        className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium text-xs sm:text-sm shadow
                                        ${user.status === "PENDING" ? 'bg-gray-100 text-green-600 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'}`}
                                    >
                                        <FaUserPlus /> {user.status === "PENDING" ? "Cancel request" : "Kết bạn"}
                                    </button>

                                    <button
                                        onClick={() => handleMessage(user.user.user_id)}
                                        className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium text-xs sm:text-sm shadow bg-pink-500 text-white hover:bg-pink-600 active:scale-95 ${messaged[user.user.user_id] ? 'animate-pulse' : ''}`}
                                    >
                                        <FaEnvelope /> {messaged[user.user.user_id] ? "Đã gửi!" : "Nhắn tin"}
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
export default Friend;