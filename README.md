This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



<!-- doc improve -->
1. Cài đặt thư viện virtualization
Bạn nên dùng `react-window` vì nhẹ, dễ dùng.
Chạy lệnh sau:
Apply to ChatList.jsx
Run
2. Cấu trúc dữ liệu & API
API backend cần hỗ trợ lấy tin nhắn theo limit và before_message_id (hoặc offset).
Khi vào phòng chat, chỉ lấy 50-100 tin nhắn cuối.
Khi kéo lên, gọi API lấy thêm các tin nhắn cũ hơn.
3. Tích hợp react-window vào chat
a. Tạo component VirtualizedChatList
Ví dụ (giả sử bạn đã có mảng messages):
Apply to ChatList.jsx
b. Lazy load khi kéo lên đầu
Bắt sự kiện onScroll của List.
Nếu scrollOffset === 0, gọi API lấy thêm tin nhắn cũ, prepend vào mảng messages.
Ví dụ:
Apply to ChatList.jsx
Thêm prop onScroll={handleScroll} vào List.
c. Scroll xuống cuối khi vào phòng chat hoặc có tin nhắn mới
Khi vào phòng chat hoặc nhận tin nhắn mới, gọi:
Apply to ChatList.jsx
listRef là ref của List (useRef(null)).
4. Tóm tắt luồng hoạt động
Vào phòng chat:
Gọi API lấy 50-100 tin nhắn cuối, render bằng react-window.
Scroll xuống cuối bằng scrollToItem.
Kéo lên đầu:
Gọi API lấy thêm tin nhắn cũ, prepend vào mảng, giữ nguyên vị trí scroll.
Gửi/nhận tin nhắn mới:
Thêm vào cuối mảng, scroll xuống cuối.
5. Bạn muốn gì tiếp theo?
Mẫu code cụ thể cho từng bước trên?
Refactor luôn file chat của bạn sang virtual scroll?
Hướng dẫn backend hỗ trợ API lấy tin nhắn theo limit và before_message_id?
Hãy chọn 1 hoặc nhiều mục, mình sẽ hướng dẫn chi tiết cho bạn!