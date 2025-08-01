"use client";
import { useEffect, useState } from "react";
import { FaUsers, FaUserFriends, FaUserCheck, FaSearchPlus, FaSpinner } from "react-icons/fa";
import { searchUsers, acceptFriendRequest, rejectFriendRequest, addFriend } from "@/app/service/FriendService";
import toast, { Toaster } from 'react-hot-toast';

const Friend = ({ users, user }) => {
    const [activeTab, setActiveTab] = useState("WAIT");
    const [added, setAdded] = useState({});
    const [messaged, setMessaged] = useState({});
    const [userList, setUserList] = useState([]);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(user?.user_id || null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingActions, setLoadingActions] = useState({});


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
                    setIsLoading(true);
                    const response = await searchUsers(user.user_id, debouncedSearch);
                    setSuggestions(Array.isArray(response) ? response : []);
                } catch (error) {
                    console.error("Error searching users:", error);
                    setSuggestions([]);
                } finally {
                    setIsLoading(false);
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

    const setLoading = (friendId, value) => {
        setLoadingActions(prev => ({ ...prev, [friendId]: value }));
    };

    const handleAddFriend = async (userId, friendId) => {
        if (loadingActions[friendId]) return; // Prevent multiple clicks
        setLoading(friendId, true);
        try {
            const response = await addFriend(friendId, userId);
            console.log("Add friend response:", response); // Debug log
            setAdded(prev => ({ ...prev, [friendId]: true }));
            toast.success("Đã gửi lời mời kết bạn thành công! 🎉");
            // Remove user from suggestions list after successful add friend
            if (activeTab === "suggestions") {
                setUserList(prev => {
                    const filtered = prev.filter(user => user.user_id !== friendId);
                    console.log("Filtered suggestions:", filtered); // Debug log
                    return filtered;
                });
            }
        } catch (error) {
            console.error("Error adding friend:", error);
            toast.error("Có lỗi xảy ra khi gửi lời mời kết bạn! 😢");
        } finally {
            setLoading(friendId, false);
        }
    };

    const handleMessage = (id) => {
        if (loadingActions[id]) return; // Prevent multiple clicks
        setLoading(id, true);
        setMessaged(prev => ({ ...prev, [id]: true }));
        toast.success("Chuyển đến trang chat! 💬");
        setTimeout(() => {
            setMessaged(prev => ({ ...prev, [id]: false }));
            setLoading(id, false);
        }, 1200);
    };

    const TABS = [
        { label: "Lời mời kết bạn", key: "WAIT", icon: <FaUserCheck /> },
        { label: "Bạn bè", key: "ACCEPTED", icon: <FaUserFriends /> },
        { label: "Đã gửi", key: "PENDING", icon: <FaUsers /> },
        { label: "Tìm Kiếm", key: "suggestions", icon: <FaSearchPlus /> },
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
        if (loadingActions[friend_id]) return; // Prevent multiple clicks
        setLoading(friend_id, true);
        try {
            toast.error("Ai cho? Hỏi người ta chưa? tự quết định à");
            // const data = await rejectFriendRequest(user_id, friend_id);
            // if(data.status === 200){
            //     toast.success("Đã từ chối lời mời kết bạn! 👋");
            // }
            // Remove user from current list after reject
            setUserList(prev => prev.filter(user => {
                if (activeTab === "suggestions") {
                    return user.user_id !== friend_id;
                } else {
                    return user.user?.user_id !== friend_id;
                }
            }));
        } catch (error) {
            console.error("Error rejecting friend request:", error);
            toast.error("Có lỗi xảy ra khi từ chối lời mời! 😢");
        } finally {
            setTimeout(() => setLoading(friend_id, false), 1000); // Reset sau 1 giây
        }
    };

    const handleAccept = async (user_id, friend_id) => {
        if (loadingActions[friend_id]) return; // Prevent multiple clicks
        setLoading(friend_id, true);
        try {
            const data = await acceptFriendRequest(user_id, friend_id);
            console.log("Accept response:", data); // Debug log
            toast.success("Đã thêm một con mồi vào nồi! 🎉");
            // Remove user from current list after successful accept
            setUserList(prev => {
                const filtered = prev.filter(user => {
                    if (activeTab === "suggestions") {
                        return user.user_id !== friend_id;
                    } else {
                        return user.user?.user_id !== friend_id;
                    }
                });
                console.log("Filtered list:", filtered); // Debug log
                return filtered;
            });
        } catch (error) {
            console.error("Error accepting friend request:", error);
            toast.error("Có lỗi xảy ra khi chấp nhận lời mời! 😢");
        } finally {
            setLoading(friend_id, false);
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

        const isLoading = !!loadingActions[friendId];

        switch (status) {
            case "PENDING":
                return [
                    {
                        text: isLoading ? <><FaSpinner className="animate-spin mr-1" /> Đang xử lý...</> : "Hủy lời mời",
                        style: "bg-gray-100 text-red-600",
                        onClick: isLoading ? undefined : () => handleReject(currentUserId, friendId),
                        disabled: isLoading
                    }
                ];
            case "WAIT":
                return [
                    {
                        text: isLoading ? <><FaSpinner className="animate-spin mr-1" /> Đang xử lý...</> : "Chấp nhận",
                        style: "bg-green-600 text-white",
                        onClick: isLoading ? undefined : () => handleAccept(currentUserId, friendId),
                        disabled: isLoading
                    },
                    {
                        text: isLoading ? <><FaSpinner className="animate-spin mr-1" /> Đang xử lý...</> : "Từ chối",
                        style: "bg-red-600 text-white",
                        onClick: isLoading ? undefined : () => handleReject(currentUserId, friendId),
                        disabled: isLoading
                    }
                ];
            case "ACCEPTED":
                return [
                    {
                        text: isLoading ? <><FaSpinner className="animate-spin mr-1" /> Đang xử lý...</> : "Nhắn tin",
                        style: "bg-pink-500 text-white",
                        onClick: isLoading ? undefined : () => handleMessage(friendId),
                        disabled: isLoading
                    },
                    {
                        text: isLoading ? <><FaSpinner className="animate-spin mr-1" /> Đang xử lý...</> : "Hủy kết bạn",
                        style: "bg-gray-200 text-red-600",
                        onClick: isLoading ? undefined : () => handleReject(currentUserId, friendId),
                        disabled: isLoading
                    }
                ];
            default:
                return [
                    {
                        text: isLoading ? <><FaSpinner className="animate-spin mr-1" /> Đang xử lý...</> : "Kết bạn",
                        style: "bg-blue-600 text-white",
                        onClick: isLoading ? undefined : () => handleAddFriend(currentUserId, friendId),
                        disabled: isLoading
                    }
                ];
        }
    };

    return (
        <>
            <Toaster />
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
                        {isLoading ? (
                            // Skeleton loading UI
                            Array.from({ length: 4 }).map((_, idx) => (
                                <div
                                    key={idx}
                                    className="flex flex-col sm:flex-row items-center bg-white rounded-2xl shadow-md p-3 sm:p-4 gap-3 sm:gap-4 animate-pulse"
                                >
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-200" />
                                    <div className="flex-1 min-w-0 text-center sm:text-left">
                                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2 mx-auto sm:mx-0" />
                                        <div className="h-3 bg-gray-100 rounded w-1/3 mb-1 mx-auto sm:mx-0" />
                                        <div className="h-3 bg-gray-100 rounded w-1/4 mx-auto sm:mx-0" />
                                    </div>
                                    <div className="flex flex-row sm:flex-col gap-2 min-w-[120px] justify-center sm:justify-start">
                                        <div className="h-8 w-20 bg-gray-200 rounded-full" />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <>
                                {(!userList || userList.length === 0) && (
                                    <div className="text-center text-gray-400 text-sm py-8">Không tìm thấy bạn bè nào.</div>
                                )}
                                {userList && userList.map((user) => (
                                    <div
                                        key={activeTab === "suggestions" ? user.user_id : user.user?.user_id}
                                        className="flex flex-col sm:flex-row items-center bg-white rounded-2xl shadow-md p-3 sm:p-4 gap-3 sm:gap-4 hover:shadow-lg transition-all duration-300 group"
                                    >
                                        <img
                                            src={activeTab === "suggestions" ? user?.img_url : user.user?.img_url}
                                            alt={activeTab === "suggestions" ? user.display_name : user.user?.display_name}
                                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-blue-200 group-hover:scale-105 transition-transform duration-300"
                                        />

                                        <div className="flex-1 min-w-0 text-center sm:text-left">
                                            <div className="font-semibold text-sm sm:text-base text-gray-900">
                                                {activeTab === "suggestions" ? user.display_name : user.user?.display_name}
                                            </div>
                                            {activeTab !== "suggestions" && (
                                                <>
                                                    <div className="text-xs sm:text-sm text-gray-600">@{user.user?.username}</div>
                                                    <div className="text-xs text-gray-400">{user.user?.email}</div>
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
                                            {getFriendActions(user, activeTab).map((action, idx) => (
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
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
export default Friend;