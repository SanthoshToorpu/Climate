import { Page } from '@/components/app-crop-calendar-page'
import React from 'react'
import Sidebar from '@/components/ui/Sidebar'
import Navbar from '@/components/ui/Navbar'
const Crop = () => {
  return (
    <div className="flex">
    <Sidebar />
    <main className="flex-1 p-8 overflow-auto">
      <Navbar userName="Farmer " />
      <Page />
    </main>
  </div>
  )
}

export default Crop 