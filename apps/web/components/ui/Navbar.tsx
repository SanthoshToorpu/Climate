// components/Navbar.js

'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { UserRoundPen } from 'lucide-react'

import Link from 'next/link'

const Navbar = ({ userName }) => {
  return (
    <header className="flex justify-between items-center mb-8">
      <h2 className="text-3xl font-bold">Welcome back, {userName}</h2>
      <Button variant="outline" size="icon">
        {/* <Bell className="h-4 w-4" /> */}
        <Link href="/Profile">
        <Button className='h-10'><UserRoundPen/>Profile</Button>
        </Link>
      </Button>
    </header>
  )
}

export default Navbar
