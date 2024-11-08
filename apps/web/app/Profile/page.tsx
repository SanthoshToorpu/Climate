import { ProfilePage } from "@/components/app-user-profile-page";
import Navbar from "@/components/ui/Navbar";
import Sidebar from "@/components/ui/Sidebar";
import React from 'react'

const Profile = () => {
  return (
    <div className="flex">
    <Sidebar />
    <main className="flex-1 p-8 overflow-auto">
      <Navbar userName="Farmer" />
      <ProfilePage />
    </main>
  </div>
  )
}

export default Profile