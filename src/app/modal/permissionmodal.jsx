import { useEffect, useState } from "react";

export default function PermissionModal() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      // Đợi 1s để tránh popup hiện ngay khi vừa mở app
      const timeout = setTimeout(() => setShowModal(true), 1000);
      return () => clearTimeout(timeout);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert("Trình duyệt không hỗ trợ thông báo");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log("Đã cấp quyền thông báo");
    } else {
      console.log("Từ chối quyền thông báo");
    }

    setShowModal(false); // Đóng modal dù đồng ý hay từ chối
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full text-center">
        <h2 className="text-lg font-semibold mb-2">Cho phép thông báo?</h2>
        <p className="text-sm text-gray-600 mb-4">
          Bật thông báo để nhận tin nhắn mới ngay cả khi bạn không mở ứng dụng.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={requestNotificationPermission}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Cho phép
          </button>
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Bỏ qua
          </button>
        </div>
      </div>
    </div>
  );
}
