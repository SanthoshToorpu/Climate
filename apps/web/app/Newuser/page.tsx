import { Page } from '@/components/app-crop-calendar-page'
import React from 'react'
import Sidebar from '@/components/ui/Sidebar'
import Navbar from '@/components/ui/Navbar'
import { FormPage } from '@/components/app-agricultural-data-page'
const Crop = () => {
  return (
    <div className="flex">
    <Sidebar />
    <main className="flex-1 p-8 overflow-auto">
      <Navbar userName="Farmer John" />
      <FormPage />
    </main>
  </div>
  )
}

export default Crop 