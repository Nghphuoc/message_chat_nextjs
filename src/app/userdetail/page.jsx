'use client';
import UserDetailPage from "./UserDetail"
import SideBar from "../home/sideBar"
import { useState, useEffect } from "react";

const RootPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const sessionUser = sessionStorage.getItem("user");
    if (sessionUser) {
      setUser(JSON.parse(sessionUser));
    }
  }, []);

  if (!user) return <div>Loading...</div>;
  return (
    <>
    {/* <SideBar chatGroup={undefined} /> */}
    <UserDetailPage user = {user}></UserDetailPage>
    </>
  );
}

export default RootPage;