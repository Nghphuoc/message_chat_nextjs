"use client";

import { useEffect, useRef, useState } from "react";

const USER_ID = "64ee176b-ef44-4c42-937d-aba39ed0d253"; // 👈 đổi theo người dùng thật
const ROOM_ID = "7f78c2ad-b58e-44fc-958a-7d806402a5a8";
export default function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const ws = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(
      `ws://localhost:8000/api/ws/${ROOM_ID}/${USER_ID}`
    );

    ws.current.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        setMessages((prev) => {
          if (prev.some((m) => m.message_id === msg.message_id)) return prev;
          return [...prev, msg];
        });
      } catch (err) {
        console.error("Invalid message:", err);
      }
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() !== "" && ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(input.trim());
      setInput("");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-tr from-sky-50 to-blue-100 px-4">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-xl flex flex-col h-[90vh] border border-gray-200">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 font-semibold text-gray-800 text-lg">
          💬 Messenger Chat
        </div>

        {/* Chat Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
        >
          {messages.map((msg) => {
            const isMe = msg.user_id === USER_ID;
            return (
              <div key={msg.message_id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`flex flex-col items-end space-y-1
                  ${isMe
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm rounded-2xl rounded-tr-md px-3 sm:px-4 py-2 sm:py-3 shadow-sm max-w-xs sm:max-w-md"
                    : "bg-gray-200 text-gray-900 rounded-bl-none"
                  }`}
                >
                  <p>{msg.content}</p>
                  <p className="text-[10px] opacity-70 text-right mt-1">
                    {new Date(msg.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input area */}
        <div className="p-4 border-t bg-white">
          <div className="flex items-center space-x-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Aa"
              className="flex-1 px-4 py-2 text-black rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            />
            <button
              onClick={sendMessage}
              disabled={input.trim() === ""}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md transition disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

