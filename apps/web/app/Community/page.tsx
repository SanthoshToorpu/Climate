import { EnhancedFarmerCommunityComponent } from '@/components/enhanced-farmer-community'
import Navbar from '@/components/ui/Navbar'
import Sidebar from '@/components/ui/Sidebar'
import React from 'react'

const CommunityPage = () => {
  return (
    <div className="flex">
    <Sidebar />
    <main className="flex-1 p-8 overflow-auto">
      <Navbar userName="Farmer " />
      <EnhancedFarmerCommunityComponent />
    </main>
  </div>
   
  )
}

export default CommunityPage