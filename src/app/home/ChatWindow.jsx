"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { fetchOldMessages, deleteMessage } from "@/app/service/MessageService";
import "../../css/hiddenscroll.css";
import ScrollToBottomButton from "@/app/comom/scrollbutton";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import HeaderChat from "../comom/headerchat";
import ShowMessage from "@/app/comom/showmessage";
import InputChat from "@/app/comom/inputchat";
import { useRouter } from 'next/navigation';
import { Toaster, toast } from "react-hot-toast";
import use100vhFix from '@/app/hook/use100vhFix';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.locale('vi');

const EMOJIS = ["😁", "❤️", "😍", "👍", "😭", "😡"];

export default function ChatWindow({ onMenuClick, onChatListClick, chat }) {
  const router = useRouter();

  // State & Ref setup
  const [user, setUser] = useState(null);
  const [dataRoom, setDataRoom] = useState(chat ?? null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [activeEmojiPicker, setActiveEmojiPicker] = useState(null);
  const [showInputEmojiPicker, setShowInputEmojiPicker] = useState(false);
  const [replyingMessage, setReplyingMessage] = useState(null);


  const messageCache = useRef({});
  const connectionRef = useRef(null);
  const ws = useRef(null);
  const scrollRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const inputEmojiPickerRef = useRef(null);

  const USER_ID = user?.user_id;
  const ROOM_ID = dataRoom?.room_id;

  // Initialization
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    if (chat?.room_id) {
      sessionStorage.setItem("chat", JSON.stringify(chat));
      setDataRoom(chat);
    } else {
      const savedOldChat = sessionStorage.getItem("chat");
      if (savedOldChat) setDataRoom(JSON.parse(savedOldChat));
    }
  }, [chat]);

  useEffect(() => {
    if (!ROOM_ID || !USER_ID) {
      if (ws.current) ws.current.close();
      setMessages([]);
      return;
    }
    if (connectionRef.current?.roomId === ROOM_ID) return;
    if (ws.current) ws.current.close();

    const socket = new WebSocket(`${process.env.NEXT_PUBLIC_API_URL}/api/ws/${ROOM_ID}/${USER_ID}`);
    ws.current = socket;
    connectionRef.current = { roomId: ROOM_ID, socket };

    socket.onopen = () => console.log("WebSocket connected");
    socket.onerror = () => console.log("error connect!");
    socket.onclose = (event) => { if (ws.current === socket) ws.current = null; };

    socket.onmessage = (event) => handleSocketMessage(event);
    fetchMessages();

    return () => {
      if (ws.current?.readyState !== WebSocket.CLOSED) ws.current?.close();
      ws.current = null;
      connectionRef.current = null;
    };
  }, [ROOM_ID, USER_ID]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: "smooth" });
  }, [messages, dataRoom]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) setActiveEmojiPicker(null);
      if (inputEmojiPickerRef.current && !inputEmojiPickerRef.current.contains(event.target)) setShowInputEmojiPicker(false);
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




  // Message Handling
  const fetchMessages = useCallback(async () => {
    if (!ROOM_ID) return;
    try {
      const oldMessages = await fetchOldMessages(ROOM_ID);
      setMessages(oldMessages);
      messageCache.current[ROOM_ID] = oldMessages;
    } catch (error) {
      console.error("error call fetchOldMessages: ", error);
    }
  }, [ROOM_ID]);

  const removeMessage = async (message_id) => {
    // try {
    //   await deleteMessage(message_id);
    //   setMessages(prev => prev.filter(msg => msg.message_id !== message_id));
    // } catch (error) {
    //   console.error("error deleting message: ", error);
    // }

    const payload = {
      type: "delete_message",
      data: {
        message_id: message_id
      },
    };

    try {
      ws.current.send(JSON.stringify(payload));
    } catch (error) {
      console.error("Error recall function: ", error);
    }
  };

  const sendMessage = useCallback(() => {
    if (!input.trim()) return;
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;

    const payload = {
      type: "message",
      data: {
        content: input.trim(),
        reply: replyingMessage?.message_id || null,
      },
    };

    try {
      ws.current.send(JSON.stringify(payload));
      setInput("");
      setReplyingMessage("");
      setIsTyping(false);
      clearTimeout(typingTimeoutRef.current);
    } catch (error) {
      console.error("Error sendMessage function: ", error);
    }
  }, [input]);

  const handleSocketMessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.type === "error") {
      toast(`Error ${msg.message}`, {
        icon: '😭',
        style: { borderRadius: '10px', background: '#333', color: '#fff' },
      });
      return;
    }
    if (msg.type === "message") {
      const newMessage = msg.data;
      const messageWithReply = {
        ...newMessage,
        reply: newMessage.reply ?? null,
      };

      setMessages(prev => {
        if (prev.some(m => m.message_id === messageWithReply.message_id)) return prev;

        const updated = [...prev, messageWithReply];
        messageCache.current[ROOM_ID] = updated;
        return updated;
      });
    } else if (msg.type === "reaction") {
      const { reaction_id, message_id, emoji, user_id } = msg.data;
      handleReaction(reaction_id, message_id, emoji, user_id);
    } else if (msg.type === "cancel_reaction") {
      const { reaction_id, message_id, user_id } = msg.data;
      handleCancelReaction(reaction_id, message_id, user_id);
    } else if (msg.type === "delete_message") {
      handleRemoveMessage(msg.data);
    }
  };

  // Input events
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    if (!isTyping && value.trim()) setIsTyping(true);
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

  // Reactions
  const addReaction = (message_id, emoji, user_id) => {
    const payload = { type: "reaction", data: { user_id, message_id, emoji } };
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;
    try {
      ws.current.send(JSON.stringify(payload));
    } catch (error) {
      console.error("Error addReaction function: ", error);
    }
  };

  const removeReacion = (message_id, emoji, user_id, reaction_id) => {
    const payload = {
      type: "cancel_reaction",
      data: { user_id, message_id, emoji, reaction_id }
    };
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;
    try {
      ws.current.send(JSON.stringify(payload));
    } catch (error) {
      console.error("Error removeReaction function: ", error);
    }
  };

  const handleReaction = (reaction_id, message_id, emoji, user_id) => {
    setMessages(prevMessages =>
      prevMessages.map(msg => {
        if (msg.message_id !== message_id) return msg;
        let currentReactions = Array.isArray(msg.icon) ? [...msg.icon] : [];
        const existingIndex = currentReactions.findIndex(r => r.user_id === user_id);

        if (existingIndex !== -1) {
          currentReactions[existingIndex] = {
            ...currentReactions[existingIndex], emoji, created_at: new Date().toISOString()
          };
        } else {
          currentReactions.push({ message_id, user_id, emoji, created_at: new Date().toISOString(), reaction_id });
        }

        return { ...msg, icon: currentReactions };
      })
    );
  };

  const handleCancelReaction = (reaction_id, message_id, user_id) => {
    setMessages(prevMessages =>
      prevMessages.map(msg => {
        if (msg.message_id !== message_id) return msg;
        const updatedReactions = Array.isArray(msg.icon)
          ? msg.icon.filter(r => !(r.reaction_id === reaction_id && r.user_id === user_id))
          : [];
        return { ...msg, icon: updatedReactions };
      })
    );
  };

  const handleRemoveMessage = (updatedMessage) => {
    setMessages(prevMessages =>
      prevMessages.map(msg => {
        // Trường hợp 1: update chính message
        if (msg.message_id === updatedMessage.message_id) {
          return { ...msg, ...updatedMessage };
        }

        // Trường hợp 2: update message nằm trong reply
        if (msg.reply && msg.reply.message_id === updatedMessage.message_id) {
          return {
            ...msg,
            reply: {
              ...msg.reply,
              ...updatedMessage,
            },
          };
        }

        // Không liên quan → giữ nguyên
        return msg;
      })
    );
  };


  

  // UI render
  if (!dataRoom) return (
    <section className="flex items-center justify-center h-full font-extrabold text-gray-500">
      <p className="text-xl text-center">No chat selected. Please select a chat to start messaging.</p>
    </section>
  );

  return (
    <section style={{ height: 'calc(var(--vh, 1vh) * 100)' }} className="flex flex-col">
      <Toaster />
      <HeaderChat dataRoom={dataRoom} />
      <ShowMessage
        scrollRef={scrollRef}
        messages={messages}
        dataRoom={dataRoom}
        USER_ID={USER_ID}
        isTyping={isTyping}
        activeEmojiPicker={activeEmojiPicker}
        setActiveEmojiPicker={setActiveEmojiPicker}
        addReaction={addReaction}
        emojiPickerRef={emojiPickerRef}
        remove={removeReacion}
        deleteMessage={removeMessage}
        setReplyingMessage={setReplyingMessage}
        replyingMessage={replyingMessage}
      />
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
        replyingMessage={replyingMessage}
        setReplyingMessage={setReplyingMessage}
      />
      <div className="absolute bottom-15 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <ScrollToBottomButton scrollRef={scrollRef} />
      </div>
    </section>
  );
}