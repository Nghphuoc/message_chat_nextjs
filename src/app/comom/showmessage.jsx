"use client";
import { useRef } from "react";
import "../../css/hiddenscroll.css";
import 'dayjs/locale/vi';
import { format, isToday, isYesterday, isSameDay } from 'date-fns';
import { vi } from 'date-fns/locale';
import {deleteIcon} from '@/app/service/MessageService'


const EMOJIS = [
    "😁", "❤️", "😍", "👍", "😭", "😡"
];

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
    emojiPickerRef 
}) => {

    //const emojiPickerRef = useRef(null);
    const formatTimeHeader = (date) => {
        if (isToday(date)) return 'Hôm nay';
        if (isYesterday(date)) return 'Hôm qua';
        return format(date, 'EEEE, dd/MM/yyyy', { locale: vi });
    };

    const fetchingDeletereaction = async (reaction_id, user_id) => {
        console.log("reaction id: ". reaction_id);
        try {
            const response = await deleteIcon(reaction_id, user_id);
            console.log(response);
        } catch (error) {
            console.error("error: ", error);
        }
    }
    
    return (
        <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 bg-white scrollbar-hide"
        >
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
                                                : 'bg-gray-200 text-gray-900 rounded-2xl rounded-bl-md'}`}
                                    >
                                        <p>{msg.content}</p>
                                        {/* Reaction button */}
                                        <button
                                            onClick={() => toggleEmojiPicker(msg.message_id)}
                                            className={`absolute -bottom-2 p-1.5 rounded-full opacity-0 group-hover:opacity-100 ${isMe
                                                ? 'bg-white/20 hover:bg-white/30 -left-4'
                                                : 'bg-gray-300/50 hover:bg-gray-400/50 -right-5'
                                                }`}
                                        >
                                            <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                                            </svg>
                                        </button>
                                        {/* Emoji picker button add emoji */}
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
                                    {/* Reactions display ( show ) click again to delete */}
                                    {Array.isArray(msg.icon) && msg.icon.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {msg.icon.map((reaction) => (
                                                <button
                                                    key={reaction.reaction_id}
                                                    onClick={() => {
                                                        fetchingDeletereaction(reaction.reaction_id, USER_ID);
                                                        setActiveEmojiPicker(null); // ẩn picker
                                                    }}
                                                    className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 border transition-all
                                                        ${isMe
                                                            ? 'bg-blue-100 text-blue-600 border-blue-200 font-bold'
                                                            : 'bg-gray-100 text-gray-600 border-gray-200'
                                                        }`}
                                                >
                                                    <span className="text-base">{reaction.emoji}</span>
                                                    <span className="font-medium">1</span> {/* hoặc reaction.count nếu có */}
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
            {/* Typing Indicator */}
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