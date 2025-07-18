"use client";
import { FiPaperclip } from "react-icons/fi";
import { GrEmoji } from "react-icons/gr";
import { GoPaperAirplane } from "react-icons/go";
import { useRef, useEffect } from "react";

// Emoji data
const EMOJIS = [
    "😁", "❤️", "😍", "👍", "😭", "😡"
];

const InputChat = ({
    input,
    setInput,
    sendMessage,
    isTyping,
    setIsTyping,
    ws,
    typingTimeoutRef,
    showInputEmojiPicker,
    setShowInputEmojiPicker,
    inputEmojiPickerRef,
    handleInputChange,
    handleInputFocus,
    handleInputBlur,
    setReplyingMessage,
    replyingMessage
}) => {
    const inputRef = useRef(null);
    useEffect(() => {
        if (replyingMessage && inputRef.current) {
            inputRef.current.focus();
        }
    }, [replyingMessage]);
    // Xử lý Enter gửi, Shift+Enter xuống dòng
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };
    const checkFoucusInput = () => {
        if (replyingMessage) {
            handleInputFocus = true;
        }
    };
    return (
        <>
            <form
                className="flex items-center space-x-2 border-t border-gray-200 pt-3 px-4 pb-2 bg-white"
                onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                }}
            >
                {/* button send file */}
                <button
                    type="button"
                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                    title="Attach file"
                >
                    <svg className="w-4 h-4">
                        <FiPaperclip />
                    </svg>
                </button>
                <div className="relative w-full">
                    {/* Reply Preview */}
                    {replyingMessage && (
                        <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-l-4 border-blue-500 rounded-t-md text-sm">
                            <div className="truncate max-w-[85%] text-gray-800">
                                <span className="font-semibold">{replyingMessage.name_user}</span>: {replyingMessage.content}
                            </div>
                            <button
                                type="button"
                                onClick={() => setReplyingMessage(null)}
                                className="text-gray-400 hover:text-gray-700 text-xs ml-2"
                                title="Cancel reply"
                            >
                                ❌
                            </button>
                        </div>
                    )}

                    {/* Input TextArea + Emoji */}
                    <div className="relative flex items-center bg-white border border-gray-200 rounded-full px-3 py-2 shadow-sm">
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={handleInputChange}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                            onKeyDown={handleKeyDown}
                            rows={1}
                            placeholder="Type your message here..."
                            className="w-full resize-none bg-transparent text-sm text-gray-700 focus:outline-none scrollbar-hide max-h-40 pr-9"
                            style={{ lineHeight: '1.5' }}
                        />

                        {/* Emoji Picker Button */}
                        <button
                            type="button"
                            onClick={() => setShowInputEmojiPicker(v => !v)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                        >
                            <GrEmoji />
                        </button>
                    </div>

                    {/* Emoji Picker */}
                    {showInputEmojiPicker && (
                        <div
                            ref={inputEmojiPickerRef}
                            className="absolute bottom-14 right-2 bg-white border border-gray-200 rounded-lg shadow-xl p-2 z-50 w-[220px]"
                        >
                            <div className="grid grid-cols-6 gap-1 max-h-40 overflow-y-auto scrollbar-hide">
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
                    title="send message"
                    disabled={!input.trim()}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-blue-600 hover:to-purple-700 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <GoPaperAirplane />
                </button>
            </form>
        </>
    );
};

export default InputChat;