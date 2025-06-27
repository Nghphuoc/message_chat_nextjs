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

function FriendCard({ user, status, onAccept, onReject }) {
  return (
    <div
      className="flex items-center gap-3 h-[80px] bg-white rounded-md border border-gray-200 px-3 py-2 mb-2 hover:bg-gray-100 hover:border-blue-200 transition-colors"
    >
      <img
        src={user.img_url}
        alt={user.display_name}
        className="w-12 h-12 rounded-full object-cover border border-gray-300"
      />
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-800 truncate">{user.display_name}</div>
        <div className="text-xs text-gray-400 truncate">@{user.username}</div>
      </div>
      {status === "WAIT" && (
        <div className="flex gap-2">
          <button
            onClick={onAccept}
            className="px-3 py-1 text-xs rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            Chấp nhận
          </button>
          <button
            onClick={onReject}
            className="px-3 py-1 text-xs rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
          >
            Xóa
          </button>
        </div>
      )}
      {status === "ACCEPTED" && (
        <span className="text-xs text-green-500 font-medium">Bạn bè</span>
      )}
    </div>
  );
}

export default function FriendRequestPage() {
  const [data, setData] = useState(sampleData);
  const [tab, setTab] = useState('request');

  const handleAccept = (user_id) => {
    setData((prev) =>
      prev.map((item) =>
        item.user.user_id === user_id ? { ...item, status: "ACCEPTED" } : item
      )
    );
  };
  const handleReject = (user_id) => {
    setData((prev) => prev.filter((item) => item.user.user_id !== user_id));
  };

  const waiting = data.filter((item) => item.status === "WAIT");
  const accepted = data.filter((item) => item.status === "ACCEPTED");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-2 sm:px-0">
      <div className="w-full max-w-md">
        <div className="flex border-b border-gray-200 mb-4">
          <button
            className={`flex-1 py-2 text-center font-semibold transition-colors ${tab === 'request' ? 'text-blue-600 border-b-2 border-blue-500 bg-white' : 'text-gray-500 bg-gray-100'}`}
            onClick={() => setTab('request')}
          >
            Yêu cầu kết bạn ({waiting.length})
          </button>
          <button
            className={`flex-1 py-2 text-center font-semibold transition-colors ${tab === 'friend' ? 'text-green-600 border-b-2 border-green-500 bg-white' : 'text-gray-500 bg-gray-100'}`}
            onClick={() => setTab('friend')}
          >
            Bạn bè ({accepted.length})
          </button>
        </div>
        <div>
          {tab === 'request' && (
            waiting.length === 0 ? (
              <div className="text-gray-400 italic text-center py-8">Không có yêu cầu nào đang chờ...</div>
            ) : (
              waiting.map((item) => (
                <FriendCard
                  key={item.user.user_id}
                  user={item.user}
                  status={item.status}
                  onAccept={() => handleAccept(item.user.user_id)}
                  onReject={() => handleReject(item.user.user_id)}
                />
              ))
            )
          )}
          {tab === 'friend' && (
            accepted.length === 0 ? (
              <div className="text-gray-400 italic text-center py-8">Chưa có bạn nào được kết nối...</div>
            ) : (
              accepted.map((item) => (
                <FriendCard
                  key={item.user.user_id}
                  user={item.user}
                  status={item.status}
                />
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
} 