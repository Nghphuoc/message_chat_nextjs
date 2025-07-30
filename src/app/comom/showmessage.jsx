"use client";
// ====== IMPORTS ======
import { useRef, useState, useEffect } from "react";
import "../../css/hiddenscroll.css";
import 'dayjs/locale/vi';
import { format, isToday, isYesterday, isSameDay } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Toaster, toast } from "react-hot-toast";
import { LuCornerUpLeft } from "react-icons/lu";


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
    emojiPickerRef,
    remove,
    deleteMessage,
    onRightClick,
    setReplyingMessage,
    replyingMessage
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

    function formatMessageText(message) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const phoneRegex = /\b(0\d{9,10}|\+84\d{9,10})\b/g;
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

        let formatted = message
            .replace(urlRegex, (url) => `<a href="${url}" class= "underline"target="_blank">${url}</a>`)
            .replace(phoneRegex, (phone) => `<a href="tel:${phone}" class="underline">${phone}</a>`)
            .replace(emailRegex, (email) => `<a href="mailto:${email}" class="underline">${email}</a>`);
        return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
    }

    function renderReplyMessage(msg, isMe) {
        if (!msg.reply) return null;

        return (
            <div
                className={`relative mb-1 px-3 py-2 rounded-2xl text-sm ${isMe ? 'bg-blue-50 text-gray-800' : 'bg-gray-100 text-gray-700'
                    } border-l-4 ${isMe ? 'border-blue-400' : 'border-gray-300'} shadow-sm`}
            >
                <div className="flex items-center gap-2 mb-1">
                    <LuCornerUpLeft className={`w-4 h-4 ${isMe ? 'text-blue-500' : 'text-gray-500'}`} />
                    <p className="font-semibold text-sm truncate max-w-[180px]">
                        {msg.reply.name_user || 'Unknown'}
                    </p>
                </div>
                <p className="italic text-xs text-gray-600 truncate max-w-[250px]">
                    {msg.reply.is_deleted === 1 ? (<span className="text-gray-500 italic">message was deleted</span>) : (msg.reply.content || '[Hình ảnh hoặc nội dung không hỗ trợ]')}

                </p>
            </div>
        );
    };

    // ====== RENDER ======
    return (
        <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 bg-white scrollbar-hide"
        >
            <Toaster />
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

                    const isNearBottom = (() => {
                        const el = document.getElementById(`msg-${msg.message_id}`);
                        if (!el) return false;
                        const rect = el.getBoundingClientRect();
                        return rect.bottom > window.innerHeight - 100;
                    })();
                    return (
                        <div id={`msg-${msg.message_id}`} key={msg.message_id} onContextMenu={(e) => onRightClick(e, msg.message_id)}>
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
                                    <div className="relative w-3.5 h-3.5 sm:w-5 sm:h-5">
                                        <img
                                            className="w-full h-full rounded-full object-cover"
                                            src={msg.img_url || '/default-avatar.jpg'}
                                            alt={msg.name_user || 'User'}
                                        />
                                    </div>
                                )}
                                <div className={`flex flex-col items-${isMe ? 'end' : 'start'}`}>
                                    <div
                                        className={`text-sm shadow-sm px-3 py-2 max-w-xs relative group
                                            ${isMe
                                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl rounded-br-md'
                                                : 'bg-gray-200 text-gray-900 rounded-2xl rounded-bl-md'}`} >
                                        {renderReplyMessage(msg, isMe)}
                                        {msg.is_deleted === 1 ? (<p className="text-gray-600 italic">message was deleted</p>) : (<p> {formatMessageText(msg.content)} </p>)}
                                        {/* ====== NÚT BA CHẤM (MENU) ====== */}
                                        <button
                                            onClick={() => setActiveMenu(activeMenu === msg.message_id ? null : msg.message_id)}
                                            className={`absolute -bottom-2 p-1.5 rounded-full opacity-0 group-hover:opacity-100 ${isMe
                                                ? 'bg-white/20 hover:bg-white/30 -left-4'
                                                : 'bg-gray-300/50 hover:bg-gray-400/50 -right-5 text-black'
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
                                                className={`absolute z-50 w-[150px] bg-white border border-gray-200 rounded-2xl shadow-lg p-1
                                                ${isMe ? 'right-1/8' : 'left-1/8'}
                                                ${isNearBottom ? 'bottom-full mb-2' : 'top-full mt-2'}`}
                                            >
                                                <button
                                                    className="block w-full px-4 py-2 text-left text-black hover:bg-gray-100 rounded"
                                                    onClick={() => {
                                                        setActiveMenu(null);
                                                        setActiveEmojiPicker(msg.message_id);
                                                        setActiveMenu(!activeMenu);
                                                    }}
                                                >
                                                    Send Reaction
                                                </button>

                                                {msg.is_deleted === 1 ? (<p></p>) : (<button className="block w-full px-4 py-2 text-left text-black hover:bg-gray-100 rounded"
                                                    onClick={() => {
                                                        setReplyingMessage({
                                                            message_id: msg.message_id,
                                                            name_user: msg.name_user,
                                                            content: msg.content,
                                                        });
                                                        setActiveMenu(null); // đóng menu
                                                    }}
                                                >
                                                    Reply
                                                </button>)}

                                                {isMe && (
                                                    <div>
                                                        <button className="block w-full px-4 py-2 text-left text-black hover:bg-gray-100 rounded"
                                                            onClick={() => {
                                                                toast("chức năng đang phát triển!!!");
                                                                setActiveMenu(!activeMenu);
                                                            }}>
                                                            Edit message
                                                        </button>
                                                        {msg.is_deleted === 1 ? (<p></p>) :
                                                            (<button
                                                                className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded text-red-500"
                                                                onClick={() => {
                                                                    setActiveMenu(null);
                                                                    deleteMessage(msg.message_id);
                                                                    setActiveMenu(!activeMenu);
                                                                }}
                                                            >
                                                                🗑️ Delete
                                                            </button>)
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {/* ====== EMOJI PICKER ====== */}
                                        {activeEmojiPicker === msg.message_id && (
                                            <div
                                                ref={emojiPickerRef}
                                                className={`absolute ${isNearBottom ? 'bottom-full mb-2' : 'top-full mt-2'}
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
                        className="h-20 w-20 rounded-full ring-2 ring-white shadow-sm mb-4 object-cover"
                        src={dataRoom.img_url || '/default-avatar.jpg'}
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
            {
                isTyping && (
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
                )
            }
        </div >
    );
};

export default ShowMessage;