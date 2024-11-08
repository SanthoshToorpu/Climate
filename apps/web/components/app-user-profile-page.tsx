'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Leaf, Thermometer, Beaker, Calendar, CloudRain, Edit } from 'lucide-react'
import Link from 'next/link'

export function ProfilePage() {
  const [userData, setUserData] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState(null)

  // Fetch user data from backend on component mount
  useEffect(() => {
    fetch('/api/submit')
      .then(response => response.json())
      .then(data => {
        if (!data.error) {
          setUserData(data)
          setEditedData({
            name: data.username,
            email: "john.farmer@example.com", // Replace with actual email if available
            avatar: "https://images.unsplash.com/photo-1560343776-97e7d202ff0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80", // Replace with actual avatar if available
            agriculturalData: {
              N: data.N.toString(),
              P: data.P.toString(),
              K: data.K.toString(),
              temperature: data.temperature.toString(),
              humidity: data.humidity.toString(),
              ph: data.ph.toString(),
              durationmonths: data.durationMonths.toString(),
              rainfall: data.rainfall.toString(),
            }
          })
        } else {
          console.error("Error fetching user data:", data.error)
        }
      })
      .catch(error => console.error("Error fetching user data:", error))
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditedData(prev => ({
      ...prev,
      agriculturalData: {
        ...prev.agriculturalData,
        [name]: value
      }
    }))
  }

  // Update user data on the backend
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const updatedData = {
        username: editedData.name,
        phoneNumber: userData.phoneNumber, // Assuming phone number is unchanged
        crops: userData.crops, // Assuming crops list is unchanged
        N: editedData.agriculturalData.N,
        P: editedData.agriculturalData.P,
        K: editedData.agriculturalData.K,
        temperature: editedData.agriculturalData.temperature,
        humidity: editedData.agriculturalData.humidity,
        ph: editedData.agriculturalData.ph,
        durationMonths: editedData.agriculturalData.durationmonths,
        rainfall: editedData.agriculturalData.rainfall,
        city: userData.city // Assuming city is unchanged
      }

      const response = await fetch('/api/submit', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      })

      if (response.ok) {
        setUserData(editedData)
        setIsEditing(false)
      } else {
        console.error("Failed to update user data")
      }
    } catch (error) {
      console.error("Error updating user data:", error)
    }
  }

  if (!userData) return <p>Loading...</p>

  return (
    <div className="h-96 bg-cover bg-center p-6" >
      <Card className="max-w-3xl mx-auto bg-white/95 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-400 to-blue-500 rounded-t-lg text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                <AvatarImage src={userData.avatar} alt={userData.username} />
                <AvatarFallback>{userData.username.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-3xl font-bold">{userData.username}</CardTitle>
                <CardDescription className="text-green-100">{userData.email}</CardDescription>
              </div>
            </div>
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button className="bg-white text-green-600 hover:bg-green-100">
                  <Edit className="mr-2 h-4 w-4" /> Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={editedData.name}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        value={editedData.email}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                    {Object.entries(editedData.agriculturalData).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor={key} className="text-right">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </Label>
                        <Input
                          id={key}
                          name={key}
                          value={value}
                          onChange={handleInputChange}
                          className="col-span-3"
                        />
                      </div>
                    ))}
                  </div>
                  <DialogFooter>
                    <Button type="submit">Save changes</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <h2 className="text-2xl font-semibold text-green-800 mb-4">Agricultural Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-green-100 to-green-200 border-green-300 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-green-700 flex items-center">
                  <Leaf className="mr-2 h-5 w-5" /> Nutrients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-sm text-green-600">Nitrogen (N): <span className="font-semibold">{userData.N}</span></p>
                  <p className="text-sm text-green-600">Phosphorus (P): <span className="font-semibold">{userData.P}</span></p>
                  <p className="text-sm text-green-600">Potassium (K): <span className="font-semibold">{userData.K}</span></p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-blue-700 flex items-center">
                  <Thermometer className="mr-2 h-5 w-5" /> Climate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-sm text-blue-600">Temperature: <span className="font-semibold">{userData.temperature}°C</span></p>
                  <p className="text-sm text-blue-600">Humidity: <span className="font-semibold">{userData.humidity}%</span></p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-300 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-yellow-700 flex items-center">
                  <Beaker className="mr-2 h-5 w-5" /> Soil
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-sm text-yellow-600">pH Level: <span className="font-semibold">{userData.ph}</span></p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-100 to-purple-200 border-purple-300 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-purple-700 flex items-center">
                  <CloudRain className="mr-2 h-5 w-5" /> Precipitation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-sm text-purple-600">Rainfall: <span className="font-semibold">{userData.rainfall} mm</span></p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
        <CardFooter className="bg-gradient-to-r from-green-200 to-blue-200 rounded-b-lg">
          <div className="w-full flex items-center justify-between text-green-700">
            <div className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              <span>Crop Duration: <span className="font-semibold">{userData.durationMonths} months</span></span>
            </div>
            <Link href="/CropCalender">
              <Button variant="outline" className="border-green-400 text-green-700 hover:bg-green-100">
                View Crop Calendar
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
