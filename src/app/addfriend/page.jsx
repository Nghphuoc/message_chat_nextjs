'use client';
import React, { useState } from "react";

const sampleData = [
  {
    user: {
      user_id: "c40f7d45-0139-4ba2-9cf6-35bc6897091c",
      username: "jaykiGood",
      email: "emiuzu@example.com",
      phone: "0909017287",
      img_url:
        "https://scontent.fsgn8-4.fna.fbcdn.net/v/t39.30808-1/506352288_1414229889725006_6943687953008314604_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=108&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeFFt2QwZxJzgK3ctjBHzgiTXYF5I-N1njxdgXkj43WePEaPQ_ncUewMY0B9yT0-jW_JTB9lKadKQMvTqWhzSKmc&_nc_ohc=EEvzZFspzqEQ7kNvwF-qHEM&_nc_oc=AdnDpYaL7huWKQfWkA6XaNxnVimcTUw2Ey8vFDbHkZhfI3R4Lk8BDNh4jP-4GOmWkiZlfpgzWObDwGjXgARpW4_I&_nc_zt=24&_nc_ht=scontent.fsgn8-4.fna&_nc_gid=EP_REW94cxyBJgwXjp95bA&oh=00_AfNEbzAG7yQy894E9twrE1OIGfJaCFiepie1LKkqtvxjfA&oe=6857614E",
      display_name: "Hellokisty",
      created_at: "2025-06-12T04:05:33",
      role: {
        role_id: "0d727e88-2abc-4d1c-ab26-f251e403b2bd",
        role_name: "ADMIN",
        create_time: "2025-06-12T03:05:50",
      },
      flagDelete: 1,
    },
    status: "ACCEPTED",
    created_at: "2025-06-13T13:33:15",
  },
  {
    user: {
      user_id: "c40f7d45-0139-4ba2-9cf6-35bc68970911",
      username: "jaykiGood",
      email: "emiuzu@example.com",
      phone: "0909017287",
      img_url:
        "https://scontent.fsgn8-4.fna.fbcdn.net/v/t39.30808-1/506352288_1414229889725006_6943687953008314604_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=108&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeFFt2QwZxJzgK3ctjBHzgiTXYF5I-N1njxdgXkj43WePEaPQ_ncUewMY0B9yT0-jW_JTB9lKadKQMvTqWhzSKmc&_nc_ohc=EEvzZFspzqEQ7kNvwF-qHEM&_nc_oc=AdnDpYaL7huWKQfWkA6XaNxnVimcTUw2Ey8vFDbHkZhfI3R4Lk8BDNh4jP-4GOmWkiZlfpgzWObDwGjXgARpW4_I&_nc_zt=24&_nc_ht=scontent.fsgn8-4.fna&_nc_gid=EP_REW94cxyBJgwXjp95bA&oh=00_AfNEbzAG7yQy894E9twrE1OIGfJaCFiepie1LKkqtvxjfA&oe=6857614E",
      display_name: "Hellokisty",
      created_at: "2025-06-12T04:05:33",
      role: {
        role_id: "0d727e88-2abc-4d1c-ab26-f251e403b2bd",
        role_name: "ADMIN",
        create_time: "2025-06-12T03:05:50",
      },
      flagDelete: 1,
    },
    status: "ACCEPTED",
    created_at: "2025-06-13T13:33:15",
  },
  {
    user: {
      user_id: "c40f7d45-0139-4ba2-9cf6-35bc6897391c",
      username: "jaykiGood",
      email: "emiuzu@example.com",
      phone: "0909017287",
      img_url:
        "https://scontent.fsgn8-4.fna.fbcdn.net/v/t39.30808-1/506352288_1414229889725006_6943687953008314604_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=108&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeFFt2QwZxJzgK3ctjBHzgiTXYF5I-N1njxdgXkj43WePEaPQ_ncUewMY0B9yT0-jW_JTB9lKadKQMvTqWhzSKmc&_nc_ohc=EEvzZFspzqEQ7kNvwF-qHEM&_nc_oc=AdnDpYaL7huWKQfWkA6XaNxnVimcTUw2Ey8vFDbHkZhfI3R4Lk8BDNh4jP-4GOmWkiZlfpgzWObDwGjXgARpW4_I&_nc_zt=24&_nc_ht=scontent.fsgn8-4.fna&_nc_gid=EP_REW94cxyBJgwXjp95bA&oh=00_AfNEbzAG7yQy894E9twrE1OIGfJaCFiepie1LKkqtvxjfA&oe=6857614E",
      display_name: "Hellokisty",
      created_at: "2025-06-12T04:05:33",
      role: {
        role_id: "0d727e88-2abc-4d1c-ab26-f251e403b2bd",
        role_name: "ADMIN",
        create_time: "2025-06-12T03:05:50",
      },
      flagDelete: 1,
    },
    status: "ACCEPTED",
    created_at: "2025-06-13T13:33:15",
  },
  {
    user: {
      user_id: "c40f7d45-0139-4ba2-9cf6-35bc689-091c",
      username: "jaykiGood",
      email: "emiuzu@example.com",
      phone: "0909017287",
      img_url:
        "https://scontent.fsgn8-4.fna.fbcdn.net/v/t39.30808-1/506352288_1414229889725006_6943687953008314604_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=108&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeFFt2QwZxJzgK3ctjBHzgiTXYF5I-N1njxdgXkj43WePEaPQ_ncUewMY0B9yT0-jW_JTB9lKadKQMvTqWhzSKmc&_nc_ohc=EEvzZFspzqEQ7kNvwF-qHEM&_nc_oc=AdnDpYaL7huWKQfWkA6XaNxnVimcTUw2Ey8vFDbHkZhfI3R4Lk8BDNh4jP-4GOmWkiZlfpgzWObDwGjXgARpW4_I&_nc_zt=24&_nc_ht=scontent.fsgn8-4.fna&_nc_gid=EP_REW94cxyBJgwXjp95bA&oh=00_AfNEbzAG7yQy894E9twrE1OIGfJaCFiepie1LKkqtvxjfA&oe=6857614E",
      display_name: "Hellokisty",
      created_at: "2025-06-12T04:05:33",
      role: {
        role_id: "0d727e88-2abc-4d1c-ab26-f251e433b2bd",
        role_name: "ADMIN",
        create_time: "2025-06-12T03:05:50",
      },
      flagDelete: 1,
    },
    status: "ACCEPTED",
    created_at: "2025-06-13T13:33:15",
  },
  {
    user: {
      user_id: "c40f7d45-0139-4ba2-9cf6135bc6897091c",
      username: "jaykiGood",
      email: "emiuzu@example.com",
      phone: "0909017287",
      img_url:
        "https://scontent.fsgn8-4.fna.fbcdn.net/v/t39.30808-1/506352288_1414229889725006_6943687953008314604_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=108&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeFFt2QwZxJzgK3ctjBHzgiTXYF5I-N1njxdgXkj43WePEaPQ_ncUewMY0B9yT0-jW_JTB9lKadKQMvTqWhzSKmc&_nc_ohc=EEvzZFspzqEQ7kNvwF-qHEM&_nc_oc=AdnDpYaL7huWKQfWkA6XaNxnVimcTUw2Ey8vFDbHkZhfI3R4Lk8BDNh4jP-4GOmWkiZlfpgzWObDwGjXgARpW4_I&_nc_zt=24&_nc_ht=scontent.fsgn8-4.fna&_nc_gid=EP_REW94cxyBJgwXjp95bA&oh=00_AfNEbzAG7yQy894E9twrE1OIGfJaCFiepie1LKkqtvxjfA&oe=6857614E",
      display_name: "Hellokisty",
      created_at: "2025-06-12T04:05:33",
      role: {
        role_id: "0d727e88-2abc-4d1c-ab26-f251e403b2bd",
        role_name: "ADMIN",
        create_time: "2025-06-12T03:05:50",
      },
      flagDelete: 1,
    },
    status: "ACCEPTED",
    created_at: "2025-06-13T13:33:15",
  },
  {
    user: {
      user_id: "a43512ab-16b4-146cb-aaa4-86f1bf5ef07e",
      username: "XuXuP",
      email: "crush@example.com",
      phone: "0973693237",
      img_url:
        "https://scontent.fsgn8-3.fna.fbcdn.net/v/t39.30808-1/486055079_1755681831674498_6035282746831343051_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=111&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeH-1_kYJDYJMafA3h8HKJ_702s4s-Z3ms7Taziz5neazgmkd8nIUHaeU6E5iCABikeRxF5z6w0xm_GGUdgNAR1l&_nc_ohc=5Sk1rUPdAkgQ7kNvwHNPbNb&_nc_oc=Adk64CtdvLRnmnsqu75vGV7UgeWayd3YdDyu3Qq7OfFwZnH__CGE81zCTt57PG2U9iCvfAE8fJHynsjRvQ4sLjCM&_nc_zt=24&_nc_ht=scontent.fsgn8-3.fna&_nc_gid=DAhmkEDrKfMkRvhk2GeBIg&oh=00_AfPKWGJ9PIB3XN2Bk8WME601vz1vjoBN27fxJ2ogYDdelQ&oe=685763E7",
      display_name: "XuXu",
      created_at: "2025-06-12T02:26:53",
      role: {
        role_id: "0d727e88-2abc-4d1c-ab263-f251e403b2bd",
        role_name: "ADMIN",
        create_time: "2025-06-12T03:05:50",
      },
      flagDelete: 0,
    },
    status: "WAIT",
    created_at: "2025-06-27T23:22:13",
  },
  {
    user: {
      user_id: "a43512ab-16b4-46cb-aa3a4-86f1bf5ef07e",
      username: "XuXuP",
      email: "crush@example.com",
      phone: "0973693237",
      img_url:
        "https://scontent.fsgn8-3.fna.fbcdn.net/v/t39.30808-1/486055079_1755681831674498_6035282746831343051_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=111&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeH-1_kYJDYJMafA3h8HKJ_702s4s-Z3ms7Taziz5neazgmkd8nIUHaeU6E5iCABikeRxF5z6w0xm_GGUdgNAR1l&_nc_ohc=5Sk1rUPdAkgQ7kNvwHNPbNb&_nc_oc=Adk64CtdvLRnmnsqu75vGV7UgeWayd3YdDyu3Qq7OfFwZnH__CGE81zCTt57PG2U9iCvfAE8fJHynsjRvQ4sLjCM&_nc_zt=24&_nc_ht=scontent.fsgn8-3.fna&_nc_gid=DAhmkEDrKfMkRvhk2GeBIg&oh=00_AfPKWGJ9PIB3XN2Bk8WME601vz1vjoBN27fxJ2ogYDdelQ&oe=685763E7",
      display_name: "XuXu",
      created_at: "2025-06-12T02:26:53",
      role: {
        role_id: "0d727e88-2abc-4d1c-ab26-f251e403b2bd",
        role_name: "ADMIN",
        create_time: "2025-06-12T03:05:50",
      },
      flagDelete: 0,
    },
    status: "WAIT",
    created_at: "2025-06-27T23:22:13",
  },
  {
    user: {
      user_id: "a43512ab-316b4-46cb-aaa4-86f1bf5ef07e",
      username: "XuXuP",
      email: "crush@example.com",
      phone: "0973693237",
      img_url:
        "https://scontent.fsgn8-3.fna.fbcdn.net/v/t39.30808-1/486055079_1755681831674498_6035282746831343051_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=111&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeH-1_kYJDYJMafA3h8HKJ_702s4s-Z3ms7Taziz5neazgmkd8nIUHaeU6E5iCABikeRxF5z6w0xm_GGUdgNAR1l&_nc_ohc=5Sk1rUPdAkgQ7kNvwHNPbNb&_nc_oc=Adk64CtdvLRnmnsqu75vGV7UgeWayd3YdDyu3Qq7OfFwZnH__CGE81zCTt57PG2U9iCvfAE8fJHynsjRvQ4sLjCM&_nc_zt=24&_nc_ht=scontent.fsgn8-3.fna&_nc_gid=DAhmkEDrKfMkRvhk2GeBIg&oh=00_AfPKWGJ9PIB3XN2Bk8WME601vz1vjoBN27fxJ2ogYDdelQ&oe=685763E7",
      display_name: "XuXu",
      created_at: "2025-06-12T02:26:53",
      role: {
        role_id: "0d727e88-2abc-4d1c-ab26-f251e403b2bd",
        role_name: "ADMIN",
        create_time: "2025-06-12T03:05:50",
      },
      flagDelete: 0,
    },
    status: "WAIT",
    created_at: "2025-06-27T23:22:13",
  },
  {
    user: {
      user_id: "a43512ab-16b4-46cb31-aaa4-86f1bf5ef07e",
      username: "XuXuP",
      email: "crush@example.com",
      phone: "0973693237",
      img_url:
        "https://scontent.fsgn8-3.fna.fbcdn.net/v/t39.30808-1/486055079_1755681831674498_6035282746831343051_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=111&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeH-1_kYJDYJMafA3h8HKJ_702s4s-Z3ms7Taziz5neazgmkd8nIUHaeU6E5iCABikeRxF5z6w0xm_GGUdgNAR1l&_nc_ohc=5Sk1rUPdAkgQ7kNvwHNPbNb&_nc_oc=Adk64CtdvLRnmnsqu75vGV7UgeWayd3YdDyu3Qq7OfFwZnH__CGE81zCTt57PG2U9iCvfAE8fJHynsjRvQ4sLjCM&_nc_zt=24&_nc_ht=scontent.fsgn8-3.fna&_nc_gid=DAhmkEDrKfMkRvhk2GeBIg&oh=00_AfPKWGJ9PIB3XN2Bk8WME601vz1vjoBN27fxJ2ogYDdelQ&oe=685763E7",
      display_name: "XuXu",
      created_at: "2025-06-12T02:26:53",
      role: {
        role_id: "0d727e88-2abc-4d1c-ab26-f2551e403b2bd",
        role_name: "ADMIN",
        create_time: "2025-06-12T03:05:50",
      },
      flagDelete: 0,
    },
    status: "WAIT",
    created_at: "2025-06-27T23:22:13",
  },
  {
    user: {
      user_id: "a43512ab-16b4-46cb-a56aa4-86f1bf5ef07e",
      username: "XuXuP",
      email: "crush@example.com",
      phone: "0973693237",
      img_url:
        "https://scontent.fsgn8-3.fna.fbcdn.net/v/t39.30808-1/486055079_1755681831674498_6035282746831343051_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=111&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeH-1_kYJDYJMafA3h8HKJ_702s4s-Z3ms7Taziz5neazgmkd8nIUHaeU6E5iCABikeRxF5z6w0xm_GGUdgNAR1l&_nc_ohc=5Sk1rUPdAkgQ7kNvwHNPbNb&_nc_oc=Adk64CtdvLRnmnsqu75vGV7UgeWayd3YdDyu3Qq7OfFwZnH__CGE81zCTt57PG2U9iCvfAE8fJHynsjRvQ4sLjCM&_nc_zt=24&_nc_ht=scontent.fsgn8-3.fna&_nc_gid=DAhmkEDrKfMkRvhk2GeBIg&oh=00_AfPKWGJ9PIB3XN2Bk8WME601vz1vjoBN27fxJ2ogYDdelQ&oe=685763E7",
      display_name: "XuXu",
      created_at: "2025-06-12T02:26:53",
      role: {
        role_id: "0d727e88-2abc-4d1c-ab26-f251e403b2bd",
        role_name: "ADMIN",
        create_time: "2025-06-12T03:05:50",
      },
      flagDelete: 0,
    },
    status: "WAIT",
    created_at: "2025-06-27T23:22:13",
  },
  {
    user: {
      user_id: "a43512ab-16b4-4667cb-aaa4-86f1bf5ef07e",
      username: "XuXuP",
      email: "crush@example.com",
      phone: "0973693237",
      img_url:
        "https://scontent.fsgn8-3.fna.fbcdn.net/v/t39.30808-1/486055079_1755681831674498_6035282746831343051_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=111&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeH-1_kYJDYJMafA3h8HKJ_702s4s-Z3ms7Taziz5neazgmkd8nIUHaeU6E5iCABikeRxF5z6w0xm_GGUdgNAR1l&_nc_ohc=5Sk1rUPdAkgQ7kNvwHNPbNb&_nc_oc=Adk64CtdvLRnmnsqu75vGV7UgeWayd3YdDyu3Qq7OfFwZnH__CGE81zCTt57PG2U9iCvfAE8fJHynsjRvQ4sLjCM&_nc_zt=24&_nc_ht=scontent.fsgn8-3.fna&_nc_gid=DAhmkEDrKfMkRvhk2GeBIg&oh=00_AfPKWGJ9PIB3XN2Bk8WME601vz1vjoBN27fxJ2ogYDdelQ&oe=685763E7",
      display_name: "XuXu",
      created_at: "2025-06-12T02:26:53",
      role: {
        role_id: "0d727e88-2abc-4d1c-a33b26-f251e403b2bd",
        role_name: "ADMIN",
        create_time: "2025-06-12T03:05:50",
      },
      flagDelete: 0,
    },
    status: "WAIT",
    created_at: "2025-06-27T23:22:13",
  },
];

// Fake mutual friends for demo
const fakeMutualFriends = [
  [
    {
      name: "Minh Anh",
      img: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      name: "Hải Đăng",
      img: "https://randomuser.me/api/portraits/men/32.jpg",
    },
  ],
  [
    {
      name: "Khánh Linh",
      img: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Quốc Bảo",
      img: "https://randomuser.me/api/portraits/men/76.jpg",
    },
  ],
];

function Toast({ show, message, onClose }) {
  if (!show) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 text-white/80 hover:text-white">×</button>
      </div>
    </div>
  );
}

function MessageModal({ isOpen, recipient, onClose }) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  if (!isOpen || !recipient) return null;
  const handleSend = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setMessage('');
      onClose('Đã gửi tin nhắn!');
    }, 800);
  };
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fade-in">
        <div className="flex items-center mb-4">
          <img src={recipient.img_url} alt={recipient.display_name} className="w-10 h-10 rounded-full mr-3" />
          <div>
            <div className="font-semibold">Nhắn tin với {recipient.display_name}</div>
            <div className="text-xs text-gray-500">@{recipient.username}</div>
          </div>
          <button onClick={() => onClose()} className="ml-auto text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSend}>
          <textarea
            className="w-full border rounded-lg p-2 mb-3 focus:ring-2 focus:ring-blue-500"
            rows={3}
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Nhập tin nhắn..."
            required
          />
          <div className="flex gap-2">
            <button type="button" onClick={() => onClose()} className="flex-1 py-2 bg-gray-100 rounded-lg text-gray-700">Hủy</button>
            <button type="submit" disabled={isLoading || !message.trim()} className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400">{isLoading ? 'Đang gửi...' : 'Gửi tin nhắn'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FriendCard({ user, status, onAdd, onCancel, onRemove, onMessage }) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 px-3 py-3 mb-3 shadow-sm hover:shadow-md transition-all">
      <img src={user.img_url} alt={user.display_name} className="w-12 h-12 rounded-full object-cover border border-gray-300" />
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-800 truncate">{user.display_name}</div>
        <div className="text-xs text-gray-400 truncate">@{user.username}</div>
      </div>
      {status === 'SUGGEST' && (
        <>
          <button onClick={onAdd} className="px-3 py-1 text-xs rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors">Kết bạn</button>
          <button onClick={onMessage} className="px-3 py-1 text-xs rounded bg-green-500 text-white hover:bg-green-600 transition-colors">Nhắn tin</button>
        </>
      )}
      {status === 'WAIT' && (
        <button onClick={onCancel} className="px-3 py-1 text-xs rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors">Hủy lời mời</button>
      )}
      {status === 'ACCEPTED' && (
        <>
          <button onClick={onMessage} className="px-3 py-1 text-xs rounded bg-green-500 text-white hover:bg-green-600 transition-colors">Nhắn tin</button>
          <button onClick={onRemove} className="px-3 py-1 text-xs rounded bg-red-100 text-red-600 hover:bg-red-200 transition-colors ml-2">Hủy kết bạn</button>
        </>
      )}
    </div>
  );
}

export default function FriendRequestPage() {
  const [data, setData] = useState(sampleData.map(item => ({ ...item, status: item.status || 'SUGGEST' })));
  const [tab, setTab] = useState('suggest');
  const [search, setSearch] = useState('');
  const [messageModal, setMessageModal] = useState({ isOpen: false, recipient: null });
  const [toast, setToast] = useState({ show: false, message: '' });

  // Tách các nhóm
  const suggestions = data.filter(item => item.status === 'SUGGEST');
  const waiting = data.filter(item => item.status === 'WAIT');
  const accepted = data.filter(item => item.status === 'ACCEPTED');

  // Tìm kiếm trên tất cả
  const filterBySearch = arr => arr.filter(item =>
    item.user.display_name.toLowerCase().includes(search.toLowerCase()) ||
    item.user.username.toLowerCase().includes(search.toLowerCase())
  );

  // Kết bạn
  const handleAdd = user_id => {
    setData(prev => prev.map(item =>
      item.user.user_id === user_id ? { ...item, status: 'WAIT' } : item
    ));
    setToast({ show: true, message: 'Đã gửi lời mời kết bạn!' });
  };
  // Hủy lời mời
  const handleCancel = user_id => {
    setData(prev => prev.map(item =>
      item.user.user_id === user_id && item.status === 'WAIT' ? { ...item, status: 'SUGGEST' } : item
    ));
    setToast({ show: true, message: 'Đã hủy lời mời kết bạn.' });
  };
  // Hủy kết bạn
  const handleRemove = user_id => {
    setData(prev => prev.filter(item => !(item.user.user_id === user_id && item.status === 'ACCEPTED')));
    setToast({ show: true, message: 'Đã hủy kết bạn.' });
  };
  // Nhắn tin
  const handleMessage = user => {
    setMessageModal({ isOpen: true, recipient: user });
  };
  // Đóng modal nhắn tin
  const handleCloseMessageModal = (msg) => {
    setMessageModal({ isOpen: false, recipient: null });
    if (msg) setToast({ show: true, message: msg });
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 to-blue-100">
      {/* Header sticky */}
      <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex items-center h-16 gap-4">
          <h1 className="text-2xl font-bold text-blue-700 flex-1">Kết bạn</h1>
          <input
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
            placeholder="Tìm kiếm bạn bè..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>
      {/* Main layout 3 cột */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-8 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Sidebar trái */}
        <aside className="hidden md:block md:col-span-3 lg:col-span-2">
          <div className="bg-white rounded-xl shadow p-4 sticky top-24">
            <div className="font-semibold text-gray-700 mb-2">Menu</div>
            <ul className="space-y-2 text-sm">
              <li><button className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${tab==='suggest'?'bg-blue-50 text-blue-700':'hover:bg-gray-50 text-gray-700'}`} onClick={()=>setTab('suggest')}>Gợi ý kết bạn</button></li>
              <li><button className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${tab==='request'?'bg-yellow-50 text-yellow-700':'hover:bg-gray-50 text-gray-700'}`} onClick={()=>setTab('request')}>Đã gửi ({waiting.length})</button></li>
              <li><button className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${tab==='friend'?'bg-green-50 text-green-700':'hover:bg-gray-50 text-gray-700'}`} onClick={()=>setTab('friend')}>Bạn bè ({accepted.length})</button></li>
            </ul>
          </div>
        </aside>
        {/* Main content giữa */}
        <main className="col-span-1 md:col-span-6 lg:col-span-7">
          <div className="flex border-b border-gray-200 mb-6 text-sm font-semibold md:hidden">
            <button
              className={`flex-1 py-2 text-center transition-colors ${tab === 'suggest' ? 'text-blue-600 border-b-2 border-blue-500 bg-white' : 'text-gray-500 bg-gray-100'}`}
              onClick={() => setTab('suggest')}
            >
              Gợi ý kết bạn
            </button>
            <button
              className={`flex-1 py-2 text-center transition-colors ${tab === 'request' ? 'text-yellow-600 border-b-2 border-yellow-500 bg-white' : 'text-gray-500 bg-gray-100'}`}
              onClick={() => setTab('request')}
            >
              Đã gửi ({waiting.length})
            </button>
            <button
              className={`flex-1 py-2 text-center transition-colors ${tab === 'friend' ? 'text-green-600 border-b-2 border-green-500 bg-white' : 'text-gray-500 bg-gray-100'}`}
              onClick={() => setTab('friend')}
            >
              Bạn bè ({accepted.length})
            </button>
          </div>
          <div>
            {tab === 'suggest' && (
              filterBySearch(suggestions).length === 0 ? (
                <div className="text-gray-400 italic text-center py-8">Không có gợi ý nào...</div>
              ) : (
                filterBySearch(suggestions).map(item => (
                  <FriendCard
                    key={item.user.user_id}
                    user={item.user}
                    status={'SUGGEST'}
                    onAdd={() => handleAdd(item.user.user_id)}
                    onMessage={() => handleMessage(item.user)}
                  />
                ))
              )
            )}
            {tab === 'request' && (
              filterBySearch(waiting).length === 0 ? (
                <div className="text-gray-400 italic text-center py-8">Không có lời mời nào đang chờ...</div>
              ) : (
                filterBySearch(waiting).map(item => (
                  <FriendCard
                    key={item.user.user_id}
                    user={item.user}
                    status={'WAIT'}
                    onCancel={() => handleCancel(item.user.user_id)}
                  />
                ))
              )
            )}
            {tab === 'friend' && (
              filterBySearch(accepted).length === 0 ? (
                <div className="text-gray-400 italic text-center py-8">Chưa có bạn nào được kết nối...</div>
              ) : (
                filterBySearch(accepted).map(item => (
                  <FriendCard
                    key={item.user.user_id}
                    user={item.user}
                    status={'ACCEPTED'}
                    onMessage={() => handleMessage(item.user)}
                    onRemove={() => handleRemove(item.user.user_id)}
                  />
                ))
              )
            )}
          </div>
        </main>
        {/* Cột phải */}
        <aside className="hidden md:block md:col-span-3 lg:col-span-3">
          <div className="bg-white rounded-xl shadow p-4 sticky top-24">
            <div className="font-semibold text-gray-700 mb-2">Gợi ý &amp; Tips</div>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Kết bạn với những người bạn quen biết.</li>
              <li>• Tìm kiếm bạn bè bằng tên hoặc username.</li>
              <li>• Hủy lời mời nếu gửi nhầm.</li>
              <li>• Nhắn tin để làm quen trước khi kết bạn.</li>
              <li>• Giao diện tối ưu cho cả mobile và desktop.</li>
            </ul>
          </div>
        </aside>
      </div>
      {/* Modal nhắn tin */}
      <MessageModal
        isOpen={messageModal.isOpen}
        recipient={messageModal.recipient}
        onClose={handleCloseMessageModal}
      />
      {/* Toast */}
      <Toast show={toast.show} message={toast.message} onClose={() => setToast({ show: false, message: '' })} />
      {/* Animation style */}
      <style>{`
        .animate-fade-in { animation: fadeIn .25s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px);} to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
} 