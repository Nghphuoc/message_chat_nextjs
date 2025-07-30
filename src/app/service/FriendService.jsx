import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export const fetchFriends = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/chat/detail/request/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching friends:', error);
    throw error;
  }
}

export const addFriend = async (userId, friendId) => {
  try {
    const response = await axios.post(`${API_URL}/add_friend/create/${userId}/${friendId}`);
    return response.data;
  } catch (error) {
    console.error('Error adding friend:', error);
    throw error;
  }
}

export const acceptFriendRequest = async (userId, friendId) => {
  try {
    const response = await axios.put(`${API_URL}/add_friend/accept/${userId}/${friendId}`, {
      status: "ACCEPTED",
    });
    return response.data;
  } catch (error) {
    console.error('Error accepting friend request:', error);
    throw error;
  }
}

export const rejectFriendRequest = async (userId, friendId) => {
  try {
    const response = await axios.put(`${API_URL}/add_friend/reject/${userId}/${friendId}`, {
      status: "ACCEPTED",
    });
    return response.data;
  } catch (error) {
    console.error('Error rejecting friend request:', error);
    throw error;
  }
}

export const searchUsers = async (userSearchId, searchName) => {
  try {
    const response = await axios.get(`${API_URL}/add_friend/search_user/${userSearchId}/${searchName}`);
    return response.data;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
}