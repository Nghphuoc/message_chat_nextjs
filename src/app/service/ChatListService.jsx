import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export const fetchChatList = async (user_id) => {
  try {
    const response = await axios.get(`${API_URL}/api/room/user/list_chat/${user_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching chat list:", error);
    throw error;
  }
};
