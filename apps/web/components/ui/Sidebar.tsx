// components/Sidebar.js

'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Leaf, Calendar, Cloud } from 'lucide-react'
import Link from 'next/link'

const Sidebar = () => {
  return (
    <aside className="w-64 bg-card text-card-foreground h-screen p-4 flex flex-col">
      <div className="flex items-center space-x-2 mb-8">
        <Leaf className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold">StrawHatz</h1>
      </div>
      <nav className="space-y-2 flex-grow">
      <div className="flex items-center space-x-2 mt-auto">
        
        
      </div>
        <Button variant="ghost" className="w-full justify-start">
          <Link className='flex items-center' href="/Dashboard">
          <Leaf className="mr-2 h-4 w-4" /> Dashboard
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Link href="/CropCalender" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" /> Crop Calendar
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Link href="/Community" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" /> Community
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Link href="/CropRecommend" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" /> Crop Recommendation
          </Link>
        </Button>
       
        {/* <Button variant="ghost" className="w-full justify-start">
          <Cloud className="mr-2 h-4 w-4" /> Weather
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Leaf className="mr-2 h-4 w-4" /> Soil Analysis
        </Button> */}
      </nav>
      
    </aside>
  )
}

export default Sidebar
