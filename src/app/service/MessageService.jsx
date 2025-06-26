import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const fetchMessages = async (roomId, userId) => {
  try {
    const response = await axios.get(`${API_URL}/message/${roomId}/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
}

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

export const sendIcon = async (reaction) => {
  try {
    const response = await axios.post(`${API_URL}/reaction/create`, reaction);
    if ( response.status !== 201) {
      console.log("Failed to fetch messages:", response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
      } 
      return response.data;
  } catch (error) {
    console.error("error fetching sendIcon: ", error)
  }
};

export const deleteIcon = async (reaction_id) => {
  try {
    const response = await axios.delete(`${API_URL}/reaction/delete/${reaction_id}`);
    if (response.status !== 200) {
      console.log("Failed to fetch messages:", response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error delete reaction at MessageService: ", error);
  }
}