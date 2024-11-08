import Navbar from '@/components/ui/Navbar'
import Sidebar from '@/components/ui/Sidebar'
import { FormPage } from '@/components/app-agricultural-data-page'
import React from 'react'
import { DashboardComponent } from '@/components/dashboard'

const Home = () => {
  return (
    <div className="flex">
    <Sidebar />
    <main className="flex-1 p-8 overflow-auto">
      <Navbar userName="Farmer " />
      <DashboardComponent />
      </main>
  </div>
  )
}

export default Home
