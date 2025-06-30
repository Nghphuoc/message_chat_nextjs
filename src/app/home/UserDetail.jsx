import React from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/vi';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('vi');

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80';

/**
 * Props:
 * user: {
 *   user_id, username, password, email, phone, img_url, display_name, created_at, role, flagDelete
 * }
 * option?: {
 *   img_url, username, room_id, status, last_seen
 * }
 */
const UserDetail = ({ user, option }) => {
  if (!user) return <div className="p-8 text-gray-500">No user data.</div>;

  return (
    <div className="h-screen max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Cover Photo */}
      <div className="relative h-48 bg-gray-200">
        <img
          src={DEFAULT_COVER}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        {/* Profile Picture */}
        <div className="absolute left-1/2 -bottom-16 transform -translate-x-1/2">
          <img
            src={option?.img_url || user.img_url}
            alt={user.display_name}
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl bg-white"
          />
        </div>
      </div>
      {/* Main Info */}
      <div className="pt-20 pb-6 px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-1">{user.display_name}</h2>
        <p className="text-gray-500 text-lg mb-2">@{user.username}</p>
        {/* Status */}
        {option?.status !== undefined && (
          <div className="flex items-center justify-center mb-2">
            <span className={`w-3 h-3 rounded-full mr-2 ${option.status ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
            <span className="text-xs text-gray-500">
              {option.status ? 'Online' : `Offline (last seen ${option.last_seen ? dayjs(option.last_seen).tz('Asia/Ho_Chi_Minh').fromNow() : ''})`}
            </span>
          </div>
        )}
        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-4 mb-6">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full shadow transition">Add Friend</button>
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-2 rounded-full shadow transition">Message</button>
        </div>
      </div>
      {/* Info Section */}
      <div className="bg-gray-50 px-8 py-6 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div>
            <div className="mb-2">
              <span className="font-semibold text-gray-700">User ID:</span> <span className="text-gray-600">{user.user_id}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-700">Email:</span> <span className="text-gray-600">{user.email}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-700">Phone:</span> <span className="text-gray-600">{user.phone || '-'}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-700">Created At:</span> <span className="text-gray-600">{dayjs(user.created_at).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm')}</span>
            </div>
          </div>
          <div>
            <div className="mb-2">
              <span className="font-semibold text-gray-700">Role:</span> <span className="text-gray-600">{user.role?.name || '-'}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-700">Flag Delete:</span> <span className="text-gray-600">{user.flagDelete ? 'Yes' : 'No'}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-700">Password:</span> <span className="text-gray-600">{user.password ? '********' : '-'}</span>
            </div>
            {option?.room_id && (
              <div className="mb-2">
                <span className="font-semibold text-gray-700">Room ID:</span> <span className="text-gray-600">{option.room_id}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail; 