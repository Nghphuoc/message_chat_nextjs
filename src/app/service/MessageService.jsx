import axios from 'axios';

const API_URL = 'http://localhost:8000/api/message';

export const fetchMessages = async (roomId, userId) => {
  try {
    const response = await axios.get(`${API_URL}/${roomId}/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
}


// get old message of a room
export const fetchOldMessages = async (roomId) => {
    try {
      const response = await axios.get(`${API_URL}/from_room/${roomId}`);
      if (response.status !== 200) {
        console.log("Failed to fetch messages:", response.statusText);
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
};