"use client";
import { useEffect, useState } from "react";
import { FaUsers, FaUserFriends, FaUserCheck } from "react-icons/fa";
import { searchUsers, acceptFriendRequest, rejectFriendRequest, addFriend } from "@/app/service/FriendService";


const Friend = ({ users, user }) => {
    const [activeTab, setActiveTab] = useState("WAIT");
    const [added, setAdded] = useState({});
    const [messaged, setMessaged] = useState({});
    const [userList, setUserList] = useState([]);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(user?.user_id || null);
    

    useEffect(() => {
        if (users && Array.isArray(users)) {
            setUserList(users.filter(user => user.status === "WAIT"));
            setCurrentUserId(user.user_id);
        }
    }, [users, user]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 1000);

        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        if (activeTab === "suggestions" && debouncedSearch.trim() !== "" && user?.user_id) {
            const fetchSuggestions = async () => {
                try {
                    const response = await searchUsers(user.user_id, debouncedSearch);
                    setSuggestions(Array.isArray(response) ? response : []);
                } catch (error) {
                    console.error("Error searching users:", error);
                    setSuggestions([]);
                }
            };
            fetchSuggestions();
        } else if (activeTab === "suggestions") {
            setSuggestions([]);
        }
    }, [activeTab, debouncedSearch, user?.user_id]);

    useEffect(() => {
        if (activeTab === "suggestions") {
            setUserList(suggestions || []);
        } else if (users && Array.isArray(users)) {
            let filtered = users.filter(user => user.status === activeTab);
            if (debouncedSearch.trim() !== "") {
                const searchLower = debouncedSearch.toLowerCase();
                filtered = filtered.filter(user =>
                    user.user?.display_name?.toLowerCase().includes(searchLower) ||
                    user.user?.username?.toLowerCase().includes(searchLower)
                );
            }
            setUserList(filtered);
        }
    }, [users, activeTab, debouncedSearch, suggestions]);

    const handleAddFriend = (userId, friendId) => {
        fetchingAddUser(userId, friendId);
        setAdded(prev => ({ ...prev, [friendId]: true }));

    };

    const fetchingAddUser = async ( userId, friendId ) => {
        try {
          const response = await addFriend(userId, friendId);
          //setListUser(response);
          alert("Friend request sent successfully! ", response);
        } catch (error) {
          console.error("Error adding friend:", error);
        }
      };
    
    const handleMessage = (id) => {
        setMessaged(prev => ({ ...prev, [id]: true }));
        setTimeout(() => setMessaged(prev => ({ ...prev, [id]: false })), 1200);
    };

    const TABS = [
        { label: "Lời mời kết bạn", key: "WAIT", icon: <FaUserCheck /> },
        { label: "Bạn bè", key: "ACCEPTED", icon: <FaUserFriends /> },
        { label: "Đã gửi", key: "PENDING", icon: <FaUsers /> },
        { label: "Gợi ý", key: "suggestions", icon: <FaUsers /> },
    ];

    const handleCheckActiveTab = (tabKey) => {
        let filteredUsers;
        if (tabKey === "suggestions") {

        }
        filteredUsers = users.filter(user => user.status === tabKey);
        setUserList(filteredUsers);
        setActiveTab(tabKey);
    };

    const handleReject = async (user_id, friend_id) => {
        try {
            const data = await rejectFriendRequest(user_id, friend_id);
        } catch (error) {
            console.error("Error rejecting friend request:", error);
        }
    };

    const handleAccept = async (user_id, friend_id) => {
        try {
            const data = await acceptFriendRequest(user_id, friend_id);
        } catch (error) {
            console.error("Error accepting friend request:", error);
        }
    };

    const getFriendActions = (userItem, activeTab) => {
        let status, friendId;
        if (activeTab === "suggestions") {
            status = userItem.friendship_status;
            friendId = userItem.user_id;
        } else {
            status = userItem.status;
            friendId = userItem.user.user_id;
        }

        switch (status) {
            case "PENDING":
                return [
                    {
                        text: "Hủy lời mời",
                        style: "bg-gray-100 text-red-600",
                        onClick: () => handleCancelRequest(currentUserId, friendId),
                        disabled: false
                    }
                ];
            case "WAIT":
                return [
                    {
                        text: "Chấp nhận",
                        style: "bg-green-600 text-white",
                        onClick: () => handleAccept(currentUserId, friendId),
                        disabled: false
                    },
                    {
                        text: "Từ chối",
                        style: "bg-red-600 text-white",
                        onClick: () => handleReject(currentUserId, friendId),
                        disabled: false
                    }
                ];
            case "ACCEPTED":
                return [
                    {
                        text: "Nhắn tin",
                        style: "bg-pink-500 text-white",
                        onClick: () => handleMessage(friendId),
                        disabled: false
                    },
                    {
                        text: "Hủy kết bạn",
                        style: "bg-gray-200 text-red-600",
                        onClick: () => handleUnfriend(currentUserId, friendId),
                        disabled: false
                    }
                ];
            default:
                return [
                    {
                        text: "Kết bạn",
                        style: "bg-blue-600 text-white",
                        onClick: () => handleAddFriend(friendId, currentUserId),
                        disabled: false
                    }
                ];
        }
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
                        {(!userList || userList.length === 0) && (
                            <div className="text-center text-gray-400 text-sm py-8">Không tìm thấy bạn bè nào.</div>
                        )}
                        {userList && userList.map((user) => (
                            <div
                                key={activeTab === "suggestions" ? user.user_id : user.user.user_id}
                                className="flex flex-col sm:flex-row items-center bg-white rounded-2xl shadow-md p-3 sm:p-4 gap-3 sm:gap-4 hover:shadow-lg transition-all duration-300 group"
                            >
                                <img
                                    src={activeTab === "suggestions" ? user.img_url : user.user.img_url}
                                    alt={activeTab === "suggestions" ? user.display_name : user.user.display_name}
                                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-blue-200 group-hover:scale-105 transition-transform duration-300"
                                />

                                <div className="flex-1 min-w-0 text-center sm:text-left">
                                    <div className="font-semibold text-sm sm:text-base text-gray-900">
                                        {activeTab === "suggestions" ? user.display_name : user.user.display_name}
                                    </div>
                                    {activeTab !== "suggestions" && (
                                        <>
                                            <div className="text-xs sm:text-sm text-gray-600">@{user.user.username}</div>
                                            <div className="text-xs text-gray-400">{user.user.email}</div>
                                            <div className="text-xs text-blue-500 font-medium mt-1">{user.user.role?.role_name}</div>
                                        </>
                                    )}
                                    {activeTab === "suggestions" && (
                                        <div className="text-xs text-gray-500 mt-1">
                                            Trạng thái: {user.friendship_status === "PENDING" ? "Đã gửi lời mời" :
                                                user.friendship_status === "WAIT" ? "Chờ phản hồi" :
                                                    user.friendship_status === "ACCEPTED" ? "Đã kết bạn" : "Chưa kết bạn"}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-row sm:flex-col gap-2 min-w-[120px] justify-center sm:justify-start">
                                    {getFriendActions(user, activeTab, user.user_id).map((action, idx) => (
                                        <button
                                            key={idx}
                                            onClick={action.onClick}
                                            disabled={action.disabled}
                                            className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium text-xs sm:text-sm shadow ${action.style}`}
                                        >
                                            {action.text}
                                        </button>
                                    ))}
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