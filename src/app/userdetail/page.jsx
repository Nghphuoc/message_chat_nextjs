'use client';
import UserDetailPage from "./UserDetail";
import { useState, useEffect } from "react";
import withAuth from '@/app/utils/withAuth';


const RootPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const sessionUser = sessionStorage.getItem("user");
    if (sessionUser) {
      setUser(JSON.parse(sessionUser));
    }
  }, []);

  return (
    <>
    <UserDetailPage user = {user}></UserDetailPage>
    </>
  );
}

export default withAuth(RootPage);