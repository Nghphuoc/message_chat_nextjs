"use client"
import SideBar from "../home/sideBar";
import { FaCamera } from "react-icons/fa";
import { HiPencil } from "react-icons/hi2";


const UserDetailPage = ({user}) => {
  const cover_url = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80";
  return (
    <>
      <div className="hidden md:block md:w-1/4 bg-white border-r border-gray-200 shadow-sm">
        <SideBar chatGroup={undefined} />
      </div>

      <div className="min-h-screen bg-gradient-to-br  flex flex-col md:flex-row">

        <div className="flex-1 flex flex-col items-center py-0 px-0 sm:px-6">
          <div className="w-full flex justify-center bg-white">
            <div className="relative w-full">
              <img
                src={cover_url}
                alt="cover"
                className="w-full h-[350px] object-cover rounded-b-2xl"
              />
              {/* Nút thêm ảnh bìa */}
              <button className="absolute bottom-6 right-6 flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-lg shadow hover:bg-gray-100 font-semibold text-base">
                <FaCamera /> Thêm ảnh bìa
              </button>
            </div>
          </div>
          {/* Avatar + Info */}
          <div className="w-full max-w-5xl flex flex-col sm:flex-row items-center sm:items-end gap-6 px-4 relative -mt-20">
            {/* Avatar */}
            <div className="relative">
              <img
                src={user.img_url}
                alt={user.display_name}
                className="w-40 h-40 rounded-full border-4 border-white shadow-lg object-cover bg-white"
              />
              {/* Nút camera nhỏ trên avatar */}
              <button className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow border border-gray-200 hover:bg-gray-100">
                <FaCamera className="text-gray-700" />
              </button>
              
            </div>
            <div className="flex-1 flex flex-col items-center sm:items-start mt-4 sm:mt-0">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{user.display_name}</h1>
              <span className="text-gray-600 text-base mt-1">1k Friend</span>
            </div>
            <button className="flex items-center gap-2 bg-gray-100 text-gray-900 px-4 py-2 rounded-lg shadow hover:bg-gray-200 font-medium text-base">
                <HiPencil /> Edit Profile
              </button>
          </div>
        </div>
        
      </div>
    </>
  );
};

export default UserDetailPage;