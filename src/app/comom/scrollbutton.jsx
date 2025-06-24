'use client'; // Nếu dùng app router
import { HiArrowDownCircle } from "react-icons/hi2";
import { useEffect, useState } from 'react';

export default function ScrollToBottomButton({ scrollRef }) {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef?.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const bottom =
        Math.ceil(scrollContainer.scrollTop + scrollContainer.clientHeight) >= scrollContainer.scrollHeight - 2;
      setShowButton(!bottom);
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    // Kiểm tra trạng thái ban đầu
    handleScroll();
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [scrollRef]);

  const scrollToBottom = () => {
    const scrollContainer = scrollRef?.current;
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: 'smooth' });
    }
  };

  return (
    showButton && (
      <button
        onClick={scrollToBottom}
        className="z-[500] bg-gray-300 hover:bg-blue-200 text-white p-4 rounded-full shadow-lg transition duration-300"
        aria-label="Scroll to bottom"
      >
        <HiArrowDownCircle />
      </button>
    )
  );
}
