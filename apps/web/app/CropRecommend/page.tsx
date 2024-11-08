import { CropAnalysisPage } from '@/components/app-agriculture-cropRecommend'
import Navbar from '@/components/ui/Navbar'
import Sidebar from '@/components/ui/Sidebar'
import React from 'react'

const CropRecommend = () => {
  return (
    <div className="flex">
    <Sidebar />
    <main className="flex-1 p-8 overflow-auto">
      <Navbar userName="Farmer " />
      <CropAnalysisPage />
    </main>
  </div>
  )
}

export default CropRecommend