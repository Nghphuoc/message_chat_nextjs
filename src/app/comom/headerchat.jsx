"use client";
import "../../css/hiddenscroll.css";
import { GoArrowLeft } from "react-icons/go";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import { IoCall } from "react-icons/io5";
import { IoVideocam } from "react-icons/io5";
import { useEffect, useState } from "react";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.locale('vi');

const HeaderChat = ({ dataRoom }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(dataRoom);
  }, [dataRoom])

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shadow-sm">

      {/* Left: Avatar + Username + Status */}
      <div className="flex items-center space-x-3 min-w-0">
        {/* Back button - mobile only */}
        <div className="md:hidden cursor-pointer right-1.5">
          <GoArrowLeft className="w-5 h-5 text-gray-500" />
        </div>

        <img
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          src={data.img_url}
          alt={data.username}
        />

        <div className="flex flex-col min-w-0">
          <span
            className="text-base sm:text-lg font-semibold text-gray-800 truncate max-w-[150px] sm:max-w-[180px]"
            title={data.username}
          >
            {data.username}
          </span>
          <div className="flex items-center space-x-1">
            {
              data.status ? (
                <>
                  < span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-gray-500">Online</span>
                </>
              ) :
                (
                  <>
                    <span className="text-xs text-gray-500">Offline</span>
                    <span className="text-xs text-gray-500">{dayjs(data.last_seen).tz('Asia/Ho_Chi_Minh').fromNow()}</span>
                  </>
                )
            }
          </div>
        </div>
      </div>

      {/* Right: Menu and actions */}
      <div className="flex items-center space-x-1 sm:space-x-3 text-gray-400">

        <button className="p-1 sm:p-2 rounded-lg hover:bg-gray-100 hover:text-gray-600 transition-all duration-200">
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>

        <button className="p-1 sm:p-2 rounded-lg hover:bg-gray-100 hover:text-gray-600 transition-all duration-200 text-xl">
          <IoCall />
        </button>

        <button className="p-1 sm:p-2 rounded-lg hover:bg-gray-100 hover:text-gray-600 transition-all duration-200 text-xl">
          <IoVideocam />
        </button>

        <button className="p-1 sm:p-2 rounded-lg hover:bg-gray-100 hover:text-gray-600 transition-all duration-200">
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>

      </div>
    </header>
  );
};

export default HeaderChat;