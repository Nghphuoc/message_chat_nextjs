'use client';
import Friend from "./friend";
import SideBar from "@/app/home/sideBar";
import { useState, useEffect } from "react";
import { fetchFriends } from "@/app/service/FriendService";
import withAuth from '@/app/utils/withAuth';

function UserListPage() {
  const [user, setUsers] = useState([]);
  const [listUser, setListUser] = useState([]);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUsers(parsedUser);
      fetchingRequest(parsedUser.user_id);
    }

  }, []);

  const fetchingRequest = async (userId) => {
    try {
      const response = await fetchFriends(userId);
      setListUser(response);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  return (
    <>
      <SideBar />
      <Friend users={listUser} user={user} />
    </>
  );
}

export default withAuth(UserListPage);