"use client";
// ====== IMPORTS ======
import { useRef, useState, useEffect } from "react";
import "../../css/hiddenscroll.css";
import 'dayjs/locale/vi';
import { format, isToday, isYesterday, isSameDay } from 'date-fns';
import { vi } from 'date-fns/locale';
import { deleteIcon } from '@/app/service/MessageService'

const EMOJIS = ["😁", "❤️", "😍", "👍", "😭", "😡"];

// ====== COMPONENT ======
const ShowMessage = ({
    scrollRef,
    messages,
    dataRoom,
    USER_ID,
    isTyping,
    activeEmojiPicker,
    setActiveEmojiPicker,
    addReaction,
    toggleEmojiPicker,
    emojiPickerRef,
    remove,
    deleteMessage
}) => {
    // ====== STATE & REF ======
    const [activeMenu, setActiveMenu] = useState(null); // message_id của menu đang mở
    const menuRef = useRef(null);

    // ====== EFFECT: Đóng menu/emoji picker khi click ra ngoài ======
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveMenu(null);
            }
            if (
                emojiPickerRef.current &&
                !emojiPickerRef.current.contains(event.target)
            ) {
                setActiveEmojiPicker(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setActiveEmojiPicker]);

    // ====== HELPER: Định dạng ngày cho header ======
    const formatTimeHeader = (date) => {
        if (isToday(date)) return 'Hôm nay';
        if (isYesterday(date)) return 'Hôm qua';
        return format(date, 'EEEE, dd/MM/yyyy', { locale: vi });
    };

    // ====== API: Xóa reaction (không dùng trực tiếp ở đây) ======
    const fetchingDeletereaction = async (reaction_id, user_id) => {
        try {
            const response = await deleteIcon(reaction_id, user_id);
            console.log(response);
        } catch (error) {
            console.error("error: ", error);
        }
    }

    // ====== RENDER ======
    return (
        <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 bg-white scrollbar-hide"
        >
            {/* ====== HIỂN THỊ DANH SÁCH TIN NHẮN ====== */}
            {messages && messages.length > 0 ? (
                messages.map((msg, index) => {
                    const isMe = msg.user_id === USER_ID;
                    const timeString = new Date(msg.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    });
                    const currentDate = new Date(msg.created_at);
                    const prevDate =
                        index > 0 ? new Date(messages[index - 1].created_at) : null;
                    const showTimeHeader =
                        index === 0 || !isSameDay(currentDate, prevDate);
                    return (
                        <div key={msg.message_id}>
                            {showTimeHeader && (
                                <div className="flex justify-center text-xs text-gray-500 my-2">
                                    {formatTimeHeader(currentDate)}
                                </div>
                            )}
                            <div
                                className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end space-x-2`}
                            >
                                {/* Avatar for others */}
                                {!isMe && (
                                    <img
                                        className="rounded-full ring-2 ring-white shadow-sm flex-shrink-0"
                                        src={msg.img_url || '/default-avatar.jpg'}
                                        width="25"
                                        height="25"
                                        alt={msg.name_user || 'User'}
                                    />
                                )}
                                <div className={`flex flex-col items-${isMe ? 'end' : 'start'}`}>
                                    <div
                                        className={`text-sm shadow-sm px-3 py-2 max-w-xs relative group
                                            ${isMe
                                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl rounded-br-md'
                                                : 'bg-gray-200 text-gray-900 rounded-2xl rounded-bl-md'}`} >
                                        <p>{msg.content}</p>
                                        {/* ====== NÚT BA CHẤM (MENU) ====== */}
                                        <button
                                            onClick={() => setActiveMenu(activeMenu === msg.message_id ? null : msg.message_id)}
                                            className={`absolute -bottom-2 p-1.5 rounded-full opacity-0 group-hover:opacity-100 ${isMe
                                                ? 'bg-white/20 hover:bg-white/30 -left-4'
                                                : 'bg-gray-300/50 hover:bg-gray-400/50 -right-5'
                                                }`}
                                        >
                                            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                                <circle cx="5" cy="12" r="2" />
                                                <circle cx="12" cy="12" r="2" />
                                                <circle cx="19" cy="12" r="2" />
                                            </svg>
                                        </button>
                                        {/* ====== MENU LỰA CHỌN ====== */}
                                        {activeMenu === msg.message_id && (
                                            <div
                                                ref={menuRef}
                                                className={`absolute top-full mt-2 ${isMe ? 'right-1/8' : 'left-1/8'} bg-white border border-gray-200 rounded-2xl shadow-lg p-1 z-50 w-[150px]`}
                                            >
                                                <button
                                                    className="block w-full text-left px-4 py-2 text-black hover:bg-gray-100 rounded"
                                                    onClick={() => {
                                                        setActiveMenu(null);
                                                        setActiveEmojiPicker(msg.message_id);
                                                    }}
                                                >
                                                    Send Reaction
                                                </button>
                                                {isMe && (
                                                    <button
                                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded text-red-500"
                                                        onClick={() => {
                                                            setActiveMenu(null);
                                                            deleteMessage(msg.message_id);
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                        {/* ====== EMOJI PICKER ====== */}
                                        {activeEmojiPicker === msg.message_id && (
                                            <div
                                                ref={emojiPickerRef}
                                                className={`absolute top-full mt-2
                                                    ${isMe ? 'right-1/8' : 'left-1/8'}
                                                    bg-white border border-gray-200 rounded-2xl shadow-lg p-1 pl-3 pr-3 z-50 w-[300px]`}
                                            >
                                                <div className="grid grid-cols-6 gap-1 p-1">
                                                    {EMOJIS.map((emoji, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => {
                                                                addReaction(msg.message_id, emoji, USER_ID);
                                                                setActiveEmojiPicker(null); // ẩn picker
                                                            }}
                                                            className="p-1 hover:bg-gray-200 rounded-full text-xl transition-transform transform hover:scale-110"
                                                        >
                                                            {emoji}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {/* ====== HIỂN THỊ REACTION ====== */}
                                    {Array.isArray(msg.icon) && msg.icon.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {msg.icon.map((reaction) => (
                                                <button
                                                    key={reaction.reaction_id}
                                                    onClick={() => {
                                                        if (reaction.user_id === USER_ID) {
                                                            remove(msg.message_id, reaction.emoji, USER_ID, reaction.reaction_id);
                                                        }
                                                    }}
                                                    className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 border transition-all
                                                        ${reaction.user_id === USER_ID
                                                            ? 'bg-blue-100 text-blue-600 border-blue-300 font-bold'
                                                            : 'bg-gray-100 text-gray-700 border-gray-200'
                                                        }`}
                                                >
                                                    <span className="text-base">{reaction.emoji}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    <span className="text-xs font-extralight text-gray-400 mt-1">
                                        {timeString}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })
            ) : (
                // ====== KHÔNG CÓ TIN NHẮN ======
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                    <img
                        className="rounded-full ring-2 ring-white shadow-sm mb-4"
                        src={dataRoom.img_url || '/default-avatar.jpg'}
                        width="80"
                        height="80"
                        alt={dataRoom.username || 'User'}
                    />
                    <p className="text-sm font-medium">
                        No messages yet. Start the conversation with {dataRoom.username || 'this user'}!
                    </p>
                    <p className="text-xs font-extralight text-gray-400 mt-1">
                        Say hello 👋 or share something interesting to begin chatting.
                    </p>
                </div>
            )}
            {/* ====== TYPING INDICATOR ====== */}
            {isTyping && (
                <div className="flex space-x-2">
                    <div className="z-50 w-8 h-8 bg-gradient-to-b from-violet-700/80 to-blue-900/80 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                        </svg>
                    </div>
                    <div className="bg-gray-100 rounded-2xl rounded-tl-md px-3 py-2">
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShowMessage;