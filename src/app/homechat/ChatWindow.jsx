"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { fetchOldMessages } from "@/app/service/MessageService";
import "../../css/hiddenscroll.css";
import ScrollToBottomButton from "@/app/comom/scrollbutton";
import { GoPaperAirplane } from "react-icons/go";
import { GoArrowLeft } from "react-icons/go";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import { format, isToday, isYesterday, isSameDay } from 'date-fns';
import { vi } from 'date-fns/locale';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.locale('vi');

// Emoji data
const EMOJIS = [
  "😁", "❤️", "😍", "👍", "😭", "😡"
];

export default function ChatWindow({ onMenuClick, onChatListClick, chat }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  const USER_ID = user?.user_id;
  // Khởi tạo null, sẽ lấy lại sau ở client
  const [dataRoom, setDataRoom] = useState(chat ?? null);

  // Khi chat param thay đổi (VD: chuyển phòng), cập nhật lại sessionStorage và state
  useEffect(() => {
    if (chat && chat.room_id) {
      sessionStorage.setItem("chat", JSON.stringify(chat));
      setDataRoom(chat);
    } else if (!chat) {
      // Nếu không có chat param, thử lấy lại từ sessionStorage
      const savedOldChat = sessionStorage.getItem("chat");
      if (savedOldChat) {
        try {
          setDataRoom(JSON.parse(savedOldChat));
        } catch {
          setDataRoom(null);
        }
      }
    }
  }, [chat]);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [activeEmojiPicker, setActiveEmojiPicker] = useState(null);
  const [showInputEmojiPicker, setShowInputEmojiPicker] = useState(false);

  const messageCache = useRef({});
  const connectionRef = useRef(null);
  const ws = useRef(null);
  const scrollRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const inputEmojiPickerRef = useRef(null);

  const ROOM_ID = dataRoom?.room_id;

  // WebSocket connection management
  useEffect(() => {
    console.log("chat: ", chat);
    if (!ROOM_ID || !USER_ID) {
      console.log("🚫 No room ID or user ID");
      if (ws.current) ws.current.close();
      setMessages([]);
      return;
    }

    // custom input

    // useEffect(() => {
    //   const handlePaste = (e: ClipboardEvent) => {
    //     const items = e.clipboardData?.items;
    //     if (!items) return;

    //     const files: File[] = [];

    //     for (let i = 0; i < items.length; i++) {
    //       const item = items[i];
    //       if (item.kind === 'file') {
    //         const file = item.getAsFile();
    //         if (file) files.push(file);
    //       }
    //     }

    //     if (files.length > 0) {
    //       setSelectedFiles((prev) => [...prev, ...files]);
    //     }
    //   };

    //   window.addEventListener('paste', handlePaste);
    //   return () => window.removeEventListener('paste', handlePaste);
    // }, []);


    // Reuse existing connection
    if (connectionRef.current?.roomId === ROOM_ID) {
      console.log("🔄 Using existing connection");
      return;
    }

    // Close previous connection
    if (ws.current) {
      console.log("🔌 Closing previous connection");
      ws.current.close();
    }

    console.log("🔌 Creating new WebSocket connection");
    const socket = new WebSocket(`ws://localhost:8000/api/ws/${ROOM_ID}/${USER_ID}`);
    ws.current = socket;
    connectionRef.current = { roomId: ROOM_ID, socket };

    // Event handlers
    socket.onopen = () => console.log("✅ WebSocket connected");
    socket.onerror = (error) => console.error("❌ WebSocket error:", error);

    socket.onclose = (event) => {
      console.log("🔌 WebSocket closed:", event.code, event.reason);
      if (ws.current === socket) ws.current = null;
    };

    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        setMessages(prev => {
          // Prevent duplicates
          if (prev.some(m => m.message_id === msg.message_id)) return prev;

          const updated = [...prev, msg];
          messageCache.current[ROOM_ID] = updated;
          return updated;
        });
      } catch (err) {
        console.error("❌ Invalid message format:", err);
      }
    };

    // Load messages
    fetchMessages();

    return () => {
      if (ws.current?.readyState !== WebSocket.CLOSED) {
        ws.current?.close();
      }
      ws.current = null;
      connectionRef.current = null;
    };
  }, [ROOM_ID]);

  // Scroll to bottom when messages change
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    // Only scroll if user is near bottom
    const isNearBottom = scrollContainer.scrollHeight - scrollContainer.scrollTop
      <= scrollContainer.clientHeight + 100;

    if (isNearBottom) {
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages]);

  // Load messages with caching old
  const fetchMessages = useCallback(async () => {
    if (!ROOM_ID) return;

    // Use cache if available
    if (messageCache.current[ROOM_ID]) {
      setMessages(messageCache.current[ROOM_ID]);
      return;
    }

    try {
      const oldMessages = await fetchOldMessages(ROOM_ID);
      setMessages(oldMessages);
      messageCache.current[ROOM_ID] = oldMessages;
    } catch (err) {
      console.error("❌ Error fetching messages:", err);
    }
  }, [ROOM_ID]);

  // Typing indicator logic
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    // Update typing indicator
    if (!isTyping && value.trim()) {
      setIsTyping(true);
    }

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000);
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
    if (input.trim()) setIsTyping(true);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
    setIsTyping(false);
    clearTimeout(typingTimeoutRef.current);
  };

  // Send message handler
  const sendMessage = useCallback(() => {
    if (!input.trim()) return;

    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      console.error("❌ WebSocket not connected");
      return;
    }

    try {
      ws.current.send(input.trim());
      setInput("");
      setIsTyping(false);
      clearTimeout(typingTimeoutRef.current);
    } catch (error) {
      console.error("❌ Error sending message:", error);
    }
  }, [input]);

  // Emoji reactions
  const toggleEmojiPicker = useCallback((messageId) => {
    setActiveEmojiPicker(prev => prev === messageId ? null : messageId);
  }, []);

  const addReaction = useCallback((messageId, emoji) => {
    setMessages(prev => prev.map(msg => {
      if (msg.message_id !== messageId) return msg;

      const reactions = { ...(msg.reactions || {}) };
      const userReactions = [...(reactions[USER_ID] || [])];

      // Toggle reaction
      const index = userReactions.indexOf(emoji);
      if (index > -1) {
        userReactions.splice(index, 1);
      } else {
        userReactions.push(emoji);
      }

      return {
        ...msg,
        reactions: {
          ...reactions,
          [USER_ID]: userReactions
        }
      };
    }));
    setActiveEmojiPicker(null);
  }, []);

  // Utility functions for reactions
  const getReactionCount = useCallback((message, emoji) => {
    if (!message.reactions) return 0;
    return Object.values(message.reactions)
      .flat()
      .filter(e => e === emoji)
      .length;
  }, []);

  const hasUserReacted = useCallback((message, emoji) => {
    return message.reactions?.[USER_ID]?.includes(emoji) || false;
  }, []);

  // Close emoji pickers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setActiveEmojiPicker(null);
      }
      if (inputEmojiPickerRef.current && !inputEmojiPickerRef.current.contains(event.target)) {
        setShowInputEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (ws.current) ws.current.close();
      clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  // If no dataRoom, show placeholder
  if (!dataRoom) {
    return (
      <section className="flex items-center justify-center h-full text-gray-500">
        <p>No chat selected. Please select a chat to start messaging.</p>
      </section>
    );
  }

  const formatTimeHeader = (date) => {
    if (isToday(date)) return 'Hôm nay';
    if (isYesterday(date)) return 'Hôm qua';
    return format(date, 'EEEE, dd/MM/yyyy', { locale: vi });
  };

  return (
    <section className="flex flex-col flex-1 bg-gradient-to-br from-white to-gray-50 min-h-screen shadow-lg rounded-2xl border border-gray-200">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shadow-sm">

        {/* Left: Avatar + Username + Status */}
        <div className="flex items-center space-x-3 min-w-0">
          {/* Back button - mobile only */}
          <div className="md:hidden cursor-pointer right-1.5">
            <GoArrowLeft className="w-5 h-5 text-gray-500" />
          </div>

          <img
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            src={dataRoom.img_url}
            alt={dataRoom.username}
          />

          <div className="flex flex-col min-w-0">
            <span
              className="text-base sm:text-lg font-semibold text-gray-800 truncate max-w-[150px] sm:max-w-[180px]"
              title={dataRoom.username}
            >
              {dataRoom.username}
            </span>
            <div className="flex items-center space-x-1">
              {
                dataRoom.status ? (
                  <>
                    < span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-gray-500">Online</span>
                  </>
                ) :
                  (
                    <>
                      <span className="text-xs text-gray-500">Offline</span>
                      <span className="text-xs text-gray-500">{dayjs(dataRoom.last_seen).tz('Asia/Ho_Chi_Minh').fromNow()}</span>
                    </>
                  )
              }
            </div>
          </div>
        </div>

        {/* Right: Menu and actions */}
        <div className="flex items-center space-x-1 sm:space-x-3 text-gray-400">

          <button className="p-1 sm:p-2 rounded-lg hover:bg-gray-100 hover:text-gray-600 transition-all duration-200">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>

          <button className="p-1 sm:p-2 rounded-lg hover:bg-gray-100 hover:text-gray-600 transition-all duration-200">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>

          <button className="p-1 sm:p-2 rounded-lg hover:bg-gray-100 hover:text-gray-600 transition-all duration-200">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>

          <button className="p-1 sm:p-2 rounded-lg hover:bg-gray-100 hover:text-gray-600 transition-all duration-200">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>

        </div>
      </header>

      {/* Chat Messages */}
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
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg p-1 pl-3 pr-3 z-50 w-[300px]"
                        >
                          <div className="grid grid-cols-6 gap-1 p-1">
                            {EMOJIS.map((emoji, index) => (
                              <button
                                key={index}
                                onClick={() => addReaction(msg.message_id, emoji)}
                                className="p-1 hover:bg-gray-200 rounded-full text-xl transition-transform transform hover:scale-110"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Reactions display ( show )*/}

                    {msg.icon && Object.keys(msg.icon.reaction_id).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        <button
                          key={msg.icon.reaction_id}
                          onClick={() => {
                            // TODO: Add API to toggle (add/remove) emoji reaction here
                            addReaction(msg.message_id, msg.icon.emoji);
                          }}
                          className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 border transition-all
                          ${isMe
                              ? 'bg-blue-100 text-blue-600 border-blue-200 font-bold'
                              : 'bg-gray-100 text-gray-600 border-gray-200'
                            }`}
                        >
                          <span className="text-base">{msg.icon.emoji}</span>
                          <span className="font-medium">1</span>
                        </button>
                      </div>
                    )}

                    <span className="text-xs font-extralight text-gray-400 mt-1">
                      {timeString}
                    </span>

                  </div>

                  {/* Avatar for self */}

                  {isMe && (
                    <img
                      className="rounded-full ring-2 ring-white shadow-sm flex-shrink-0"
                      src={msg.img_url || '/default-avatar.jpg'}
                      width="25"
                      height="25"
                      alt="You"
                    />
                  )}
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
      {/* Message Input */}
      <form
        className="flex items-center space-x-2 border-t border-gray-200 pt-3 px-4 pb-4 bg-white"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <button
          type="button"
          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          title="Attach file"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>
        <div className="flex-1 relative">
          <input
            value={input}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            className="w-full rounded-full border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Type your message here..."
          />
          {/* Emoji picker button */}
          <button
            type="button"
            onClick={() => setShowInputEmojiPicker(v => !v)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
            </svg>
          </button>
          {/* Emoji picker for input */}
          {showInputEmojiPicker && (
            <div
              ref={inputEmojiPickerRef}
              className="absolute bottom-10 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-1.5 z-50 w-[140px]"
            >
              <div className="grid grid-cols-3 gap-1 max-h-20 overflow-y-auto">
                {EMOJIS.map((emoji, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setInput(prev => prev + emoji)}
                    className="p-1 hover:bg-gray-100 rounded text-sm hover:scale-110"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={!input.trim()}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-blue-600 hover:to-purple-700 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <GoPaperAirplane />
        </button>
      </form>
      <div className="absolute bottom-15 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
        <ScrollToBottomButton scrollRef={scrollRef} />
      </div>
    </section >
  );
}