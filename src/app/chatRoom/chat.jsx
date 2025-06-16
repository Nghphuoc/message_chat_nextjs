"use client";

import { useEffect, useRef, useState } from "react";

const USER_ID = "20121a18-deec-4229-bfd6-baaed28e18ee"; // 👈 đổi theo người dùng thật
const ROOM_ID = "f22e1d39-8a5f-4ada-8851-d3558f640bb2";
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
                <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-sm
                  ${isMe
                    ? "bg-blue-500 text-white rounded-br-none"
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
              className="flex-1 px-4 py-2 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
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

