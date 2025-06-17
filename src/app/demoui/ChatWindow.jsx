"use client";
import { useEffect, useRef, useState } from "react";
import { fetchOldMessages } from "@/app/service/MessageService"; // Import the fetch function

const USER_ID = "64ee176b-ef44-4c42-937d-aba39ed0d253"; // 👈 đổi theo người dùng thật
const ROOM_ID = "7f78c2ad-b58e-44fc-958a-7d806402a5a8";

// Emoji data
const EMOJIS = [
  "😁", "😅", "❤️", "😍", "😘", "👍", "😂", "😭", "😡"
];

export default function ChatWindow({ onMenuClick, onChatListClick }) {

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeEmojiPicker, setActiveEmojiPicker] = useState(null);
  const [showInputEmojiPicker, setShowInputEmojiPicker] = useState(false);
  const ws = useRef(null);
  const scrollRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const inputEmojiPickerRef = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(
      `ws://localhost:8000/api/ws/${ROOM_ID}/${USER_ID}`
    );

    ws.current.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        setMessages((prev) => {
          console.log("Received message:", prev);
          if (prev.some((m) => m.message_id === msg.message_id)) return prev;
          return [...prev, msg];
        });
      } catch (err) {
        console.error("Invalid message:", err);
      } finally {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
        console.log("data message:", messages);
      }
    };

    fetchMessages(); // Fetch old messages when component mounts

    return () => {
      ws.current?.close();
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // call service at package service
  const fetchMessages = async () => {
    setMessages(await fetchOldMessages(ROOM_ID)); // Clear existing messages
  };

  // Handle typing indicator
  const handleInputChange = (e) => {
    setInput(e.target.value);

    // Show typing indicator when user starts typing
    if (!isTyping && isInputFocused) {
      setIsTyping(true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Hide typing indicator after 2 seconds of no typing
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
    if (input.trim() !== "") {
      setIsTyping(true);
    }
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
    setIsTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const sendMessage = () => {
    if (input.trim() !== "" && ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(input.trim());
      setInput("");
      setIsTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  // Emoji reaction functions
  const toggleEmojiPicker = (messageId) => {
    setActiveEmojiPicker(activeEmojiPicker === messageId ? null : messageId);
  };

  const addReaction = (messageId, emoji) => {
    setMessages(prev => prev.map(msg => {
      if (msg.message_id === messageId) {
        const existingReactions = msg.reactions || {};
        const userReactions = existingReactions[USER_ID] || [];

        // Toggle emoji reaction
        const newUserReactions = userReactions.includes(emoji)
          ? userReactions.filter(e => e !== emoji)
          : [...userReactions, emoji];

        return {
          ...msg,
          reactions: {
            ...existingReactions,
            [USER_ID]: newUserReactions
          }
        };
      }
      return msg;
    }));

    setActiveEmojiPicker(null);
  };

  const getReactionCount = (message, emoji) => {
    if (!message.reactions) return 0;
    return Object.values(message.reactions).flat().filter(e => e === emoji).length;
  };

  const hasUserReacted = (message, emoji) => {
    if (!message.reactions || !message.reactions[USER_ID]) return false;
    return message.reactions[USER_ID].includes(emoji);
  };

  // Insert emoji into input
  const insertEmoji = (emoji) => {
    setInput(prev => prev + emoji);
    setShowInputEmojiPicker(false);
  };

  // Close emoji picker when clicking outside
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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <section className="flex flex-col flex-1 bg-gradient-to-br from-white to-gray-50 min-h-screen shadow-lg rounded-2xl border border-gray-200">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-200 pb-3 sm:pb-4 px-4 sm:px-6 py-3 sm:py-4 bg-white shadow-sm">
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Mobile Chat List Button */}
          <button
            onClick={onChatListClick}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
          </button>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-800">Group #1</h2>
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs sm:text-sm text-gray-500">3 online</span>
            </div>
          </div>
        </div>

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

          <div className="flex items-center -space-x-1 sm:-space-x-2">
            <img
              className="rounded-full border-2 border-white shadow-sm"
              src="https://storage.googleapis.com/a1aa/image/4cf23f41-8a5f-4d21-7197-c7ae87377368.jpg"
              width="24"
              height="24"
              alt="User"
            />
            <img
              className="rounded-full border-2 border-white shadow-sm"
              src="https://storage.googleapis.com/a1aa/image/a0773811-3e87-4fcc-ea3b-8d900e8daf49.jpg"
              width="24"
              height="24"
              alt="User"
            />
            <div className="w-5 h-5 sm:w-7 sm:h-7 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold rounded-full border-2 border-white flex items-center justify-center shadow-sm">
              +6
            </div>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex flex-col space-y-4 sm:space-y-6 overflow-y-auto scrollbar-thin px-4 sm:px-6 py-4 sm:py-6 h-[calc(100vh-200px)]">

        {/* Outgoing Message */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 h-fit">
          {messages.map((msg) => {
            const isMe = msg.user_id === USER_ID;

            return (
              <div key={msg.message_id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end space-x-2 sm:space-x-3`}>
                {/* Avatar - chỉ hiển thị nếu không phải là mình */}
                {!isMe && (
                  <div className="flex-shrink-0">
                    <img
                      className="rounded-full ring-2 ring-white shadow-sm"
                      src={msg.img_url || '/default-avatar.jpg'}
                      width="32"
                      height="32"
                      alt={msg.name_user || 'User'}
                    />
                  </div>
                )}

                {/* Message bubble */}
                <div className={`flex flex-col items-${isMe ? 'end' : 'start'} space-y-1`}>
                  <div
                    className={`text-sm shadow-sm px-3 sm:px-4 py-2 sm:py-3 max-w-xs sm:max-w-md relative group
                        ${isMe
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl rounded-tr-md'
                        : 'bg-gray-200 text-gray-900 rounded-2xl rounded-bl-md'}
                        `}
                  >
                    <p>{msg.content}</p>

                    {/* Reaction button click to send emoji ( button )*/}
                    <button
                      onClick={() => toggleEmojiPicker(msg.message_id)}
                      className={`absolute -bottom-2 -right-2 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 ${isMe ? 'bg-white/20 hover:bg-white/30' : 'bg-gray-300/50 hover:bg-gray-400/50'
                        }`}
                      title="Add reaction"
                    >
                      <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
                      </svg>
                    </button>

                    {/* Emoji picker */}
                    {activeEmojiPicker === msg.message_id && (
                      <div
                        ref={emojiPickerRef}
                        className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg p-1 z-50 w-[110px] flex flex-col items-center`}
                        style={{minWidth: 0}}
                      >
                        <div className="grid grid-cols-3 gap-1">
                          {EMOJIS.map((emoji, index) => (
                            <button
                              key={index}
                              onClick={() => addReaction(msg.message_id, emoji)}
                              className="p-1 hover:bg-gray-100 rounded-full text-base transition-all duration-150 hover:scale-110"
                              title={emoji}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Reactions display */}
                  {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {Array.from(new Set(Object.values(msg.reactions).flat())).map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => addReaction(msg.message_id, emoji)}
                          className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 transition-all duration-150 hover:scale-105 ${hasUserReacted(msg, emoji)
                              ? 'bg-blue-100 text-blue-600 border border-blue-200 shadow-sm'
                              : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200 hover:border-gray-300'
                            }`}
                          title={`${emoji} (${getReactionCount(msg, emoji)})`}
                        >
                          <span className="text-sm">{emoji}</span>
                          <span className="font-medium">{getReactionCount(msg, emoji)}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="text-xs font-extralight text-gray-400">
                    {new Date(msg.created_at).toLocaleTimeString()}
                  </span>
                </div>

                {/* Avatar - nếu là mình */}
                {isMe && (
                  <div className="flex-shrink-0">
                    <img
                      className="rounded-full ring-2 ring-white shadow-sm"
                      src={msg.img_url || '/default-avatar.jpg'}
                      width="32"
                      height="32"
                      alt="You"
                    />
                  </div>
                )}
              </div>

            );
          })}
        </div>


        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex space-x-2 sm:space-x-3">
            <div className="z-50 sm:w-8 sm:h-8 bg-gradient-to-b from-violet-700/80 to-blue-900/80 backdrop-blur-lg shadow-2xl border-r border-white/10 transform transition-transform duration-300 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
              </svg>
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-tl-md px-3 sm:px-4 py-2 sm:py-3">
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
      <form className="flex items-center space-x-2 sm:space-x-3 border-t border-gray-200 pt-3 sm:pt-4 px-4 sm:px-6 pb-4 sm:pb-6 bg-white">
        <button
          type="button"
          className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          title="Attach file"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>
        
        <div className="flex-1 relative">
          <input
            value={input}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="w-full rounded-full border border-gray-200 bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Type your message here..."
          />
          
          {/* Emoji picker button in input */}
          <button
            type="button"
            onClick={() => setShowInputEmojiPicker(!showInputEmojiPicker)}
            className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            title="Add emoji"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
            </svg>
          </button>
          
          {/* Input emoji picker */}
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
                    onClick={() => insertEmoji(emoji)}
                    className="p-1 hover:bg-gray-100 rounded text-sm transition-all duration-150 hover:scale-110"
                    title={emoji}
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
          onClick={sendMessage}
          disabled={input.trim() === ""}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm font-medium hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          Send
        </button>
      </form>
    </section>
  );
}