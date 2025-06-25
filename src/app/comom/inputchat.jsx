"use client";
import { FiPaperclip } from "react-icons/fi";
import { GrEmoji } from "react-icons/gr";
import { GoPaperAirplane } from "react-icons/go";

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
    handleInputBlur
}) => {
    return (
        <>
            <form
                className="flex items-center space-x-2 border-t border-gray-200 pt-3 px-4 pb-4 bg-white"
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
                        <GrEmoji />
                    </button>
                    {/* Emoji picker for input */}
                    {showInputEmojiPicker && (
                        <div
                            ref={inputEmojiPickerRef}
                            className="absolute bottom-10 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-1.5 z-50 w-[200px]"
                        >
                            <div className="grid grid-cols-6 gap-1 max-h-40">
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