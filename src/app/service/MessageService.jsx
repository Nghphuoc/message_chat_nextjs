import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// get old message of a room
export const fetchOldMessages = async (roomId) => {
  try {
    const response = await axios.get(`${API_URL}/message/from_room/${roomId}`);
    if (response.status !== 200) {
      console.log("Failed to fetch messages:", response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
};

export const sendIcon = async (data) => {
  try {
    const reactionData = {
      user_id: data.user_id,
      message_id: data.message_id,
      emoji: data.emoji
    };
    const response = await axios.post(`${API_URL}/reaction/create`, reactionData);
    if (response.status !== 201) {
      throw new Error("Error response status: " + response.status);
    }
    return response.data;
  } catch (error) {
    console.error("Http error! status: ", error);
    throw error;
  }
}

// Function to remove reaction
export const removeIcon = async (reactionId) => {
  try {
    const response = await axios.delete(`${API_URL}/reaction/delete/${reactionId}`);
    if (response.status !== 204) {
      throw new Error("Error response status: " + response.status);
    }
    return true;
  } catch (error) {
    console.error("Http error! status: ", error);
    throw error;
  }
}
