"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { fetchOldMessages, sendIcon } from "@/app/service/MessageService";
import "../../css/hiddenscroll.css";
import ScrollToBottomButton from "@/app/comom/scrollbutton";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import { format, isToday, isYesterday } from 'date-fns';
import { vi } from 'date-fns/locale';
import HeaderChat from "../comom/headerchat";
import ShowMessage from "@/app/comom/showmessage";
import InputChat from "@/app/comom/inputchat";
import { useRouter } from 'next/navigation';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.locale('vi');

// Emoji data
const EMOJIS = [
  "😁", "❤️", "😍", "👍", "😭", "😡"
];

export default function ChatWindow({ onMenuClick, onChatListClick, chat }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [dataRoom, setDataRoom] = useState(chat ?? null);
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

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const USER_ID = user?.user_id;
  const ROOM_ID = dataRoom?.room_id;

  useEffect(() => {
    if (chat && chat.room_id) {
      sessionStorage.setItem("chat", JSON.stringify(chat));
      setDataRoom(chat);
    } else if (!chat) {
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

  useEffect(() => {
    if (!ROOM_ID || !USER_ID) {
      if (ws.current) ws.current.close();
      setMessages([]);
      return;
    }
    if (connectionRef.current?.roomId === ROOM_ID) {
      return;
    }
    if (ws.current) {
      ws.current.close();
    }
    const socket = new WebSocket(`ws://localhost:8000/api/ws/${ROOM_ID}/${USER_ID}`);
    ws.current = socket;
    connectionRef.current = { roomId: ROOM_ID, socket };
    socket.onopen = () => { console.log("WebSocket connected"); };
    socket.onerror = () => { };
    socket.onclose = (event) => {
      if (ws.current === socket) ws.current = null;
    };

    socket.onmessage = (event) => {
      console.log("event: ", event);
      const msg = JSON.parse(event.data);

      if (msg.type === "error") {
        alert("error", msg.data);
        return;
      }

      try {
        console.log("Msg: ", msg);
        if (msg.type === "message") {
          setMessages((prev) => {
            if (prev.some((m) => m.message_id === msg.data.message_id)) return prev;
            const updated = [...prev, msg.data];
            messageCache.current[ROOM_ID] = updated;
            return updated;
          });
        }

        if (msg.type === "reaction") {
          console.log("");
        }
      } catch (error) {
        console.error("Error parsing message: ", error);
      }
    };

    fetchMessages();
    return () => {
      if (ws.current?.readyState !== WebSocket.CLOSED) {
        ws.current?.close();
      }
      ws.current = null;
      connectionRef.current = null;
    };
  }, [ROOM_ID, USER_ID]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    const isNearBottom =
      scrollContainer.scrollHeight - scrollContainer.scrollTop <=
      scrollContainer.clientHeight + 100;
    if (isNearBottom) {
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const fetChingSendIcon = async (messageId, emoji, USER_ID) => {
    const reaction = {
      user_id: USER_ID,
      message_id: messageId,
      emoji: emoji,
    };

    try {
      const data = await sendIcon(reaction);
      console.log("data response: ", data);
      return data;
    } catch (error) {
      console.error("error send Reaction: ", error);
    }
  };

  const fetchMessages = useCallback(async () => {
    if (!ROOM_ID) return;
    if (messageCache.current[ROOM_ID]) {
      setMessages(messageCache.current[ROOM_ID]);
      return;
    }
    try {
      const oldMessages = await fetchOldMessages(ROOM_ID);
      setMessages(oldMessages);
      messageCache.current[ROOM_ID] = oldMessages;
    } catch (error) {
      console.error("error call fetchOldMessages: ", error);
    }
  }, [ROOM_ID]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
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

  const sendMessage = useCallback(() => {
    if (!input.trim()) return;
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      return;
    }

    const payload = {
      type: "message",  // hoặc "send_message", tuỳ backend
      data: {
        content: input.trim(),
      }
    };

    try {
      ws.current.send(JSON.stringify(payload));
      setInput("");
      setIsTyping(false);
      clearTimeout(typingTimeoutRef.current);
    } catch (error) {
      console.error("Error sendMessage function: ", error);
    }
  }, [input]);


  const toggleEmojiPicker = useCallback((messageId) => {
    setActiveEmojiPicker((prev) => (prev === messageId ? null : messageId));
  }, []);

  const addReaction = useCallback((messageId, emoji, USER_ID) => {
    const iconData = fetChingSendIcon(messageId, emoji, USER_ID);
    setMessages((prev) =>

      prev.map((msg) => {
        if (msg.message_id !== messageId) return msg;

        const reactions = { ...(msg.reactions || {}) };
        const currentEmoji = reactions[USER_ID];

        let updatedIcon = Array.isArray(msg.icon) ? [...msg.icon] : [];

        if (currentEmoji === emoji) {
          // Gỡ bỏ reaction
          delete reactions[USER_ID];
          updatedIcon = updatedIcon.filter(r => r.user_id !== USER_ID);
        } else {
          // Gán reaction mới
          reactions[USER_ID] = emoji;

          // Nếu user đã có reaction trước đó → cập nhật emoji
          const existed = updatedIcon.find(r => r.user_id === USER_ID);
          if (existed) {
            existed.emoji = emoji;
          } else {
            updatedIcon.push({
              message_id: messageId,
              user_id: USER_ID,
              reaction_id: crypto.randomUUID(), // hoặc tạm sinh gì đó
              created_at: new Date().toISOString(),
              emoji: emoji,
            });
          }
        }

        return {
          ...msg,
          reactions,
          icon: updatedIcon,
        };
      })
    );

  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setActiveEmojiPicker(null);
      }
      if (
        inputEmojiPickerRef.current &&
        !inputEmojiPickerRef.current.contains(event.target)
      ) {
        setShowInputEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (ws.current) ws.current.close();
      clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  if (!dataRoom) {
    return (
      <section className="flex items-center justify-center h-full font-extrabold text-gray-500">
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
      <HeaderChat dataRoom={dataRoom} />
      {/* Chat Messages */}
      <ShowMessage
        scrollRef={scrollRef}
        messages={messages}
        dataRoom={dataRoom}
        USER_ID={USER_ID}
        isTyping={isTyping}
        activeEmojiPicker={activeEmojiPicker}
        setActiveEmojiPicker={setActiveEmojiPicker}
        addReaction={addReaction}
        toggleEmojiPicker={toggleEmojiPicker}
        emojiPickerRef={emojiPickerRef}
      />
      {/* Message Input */}
      <InputChat
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
        isTyping={isTyping}
        setIsTyping={setIsTyping}
        ws={ws}
        typingTimeoutRef={typingTimeoutRef}
        showInputEmojiPicker={showInputEmojiPicker}
        setShowInputEmojiPicker={setShowInputEmojiPicker}
        inputEmojiPickerRef={inputEmojiPickerRef}
        handleInputChange={handleInputChange}
        handleInputFocus={handleInputFocus}
        handleInputBlur={handleInputBlur}
      />
      <div className="absolute bottom-15 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
        <ScrollToBottomButton scrollRef={scrollRef} />
      </div>
    </section >
  );
}