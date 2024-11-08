'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Droplet, Leaf, Sun, Sprout, Bug, Wind, Plus } from 'lucide-react'

// Mock data for the crop calendar
// Mock data for the crop calendar
const cropCalendarData = {
  wheat: {
    plantingPeriod: { start: new Date(2024, 9, 29), end: new Date(2024, 10, 15) },
    fertilizationSchedule: [
      { date: new Date(2024, 10, 5), description: "Apply nitrogen fertilizer to support initial growth" },
      { date: new Date(2024, 11, 1), description: "Apply phosphorus fertilizer for root development" },
      { date: new Date(2025, 0, 10), description: "Mid-season nitrogen application to support tillering" },
      { date: new Date(2025, 2, 5), description: "Apply potassium before harvest to enhance yield quality" },
    ],
    irrigationNeeds: [
      { start: new Date(2024, 10, 1), end: new Date(2024, 10, 10), description: "Pre-planting irrigation to prepare soil" },
      { start: new Date(2024, 11, 10), end: new Date(2024, 11, 20), description: "Regular irrigation every 10 days to maintain moisture" },
      { start: new Date(2025, 0, 15), end: new Date(2025, 1, 15), description: "Increase irrigation due to dry conditions" },
      { start: new Date(2025, 1, 20), end: new Date(2025, 2, 10), description: "Gradual reduction in water as plants mature" },
    ],
    pestControl: [
      { date: new Date(2024, 10, 20), description: "Inspect for aphids and apply organic pesticide if necessary" },
      { date: new Date(2024, 11, 15), description: "Monitor for rust and apply fungicide if detected" },
      { date: new Date(2025, 0, 20), description: "Apply fungicide for mildew control during cool season" },
      { date: new Date(2025, 1, 25), description: "Inspect for late-season pests and apply pesticide as needed" },
    ],
    cropManagement: [
      { date: new Date(2024, 11, 5), description: "Perform manual weeding to control early weeds" },
      { date: new Date(2025, 0, 15), description: "Remove diseased plants to prevent spread" },
      { date: new Date(2025, 1, 10), description: "Apply growth regulator to strengthen stalks" },
    ],
    soilTesting: [
      { date: new Date(2024, 10, 2), description: "Conduct soil pH and nutrient test for fertilization planning" },
      { date: new Date(2025, 0, 18), description: "Mid-season soil test for nitrogen levels" },
    ],
    harvestingTimeline: { start: new Date(2025, 2, 10), end: new Date(2025, 2, 31) },
    weatherPatterns: [
      { start: new Date(2024, 9, 29), end: new Date(2024, 10, 31), description: "Cool season, occasional rain; monitor humidity" },
      { start: new Date(2024, 11, 1), end: new Date(2025, 0, 31), description: "Dry season; regular irrigation needed" },
      { start: new Date(2025, 1, 1), end: new Date(2025, 2, 15), description: "Warm and dry; retain soil moisture with mulching" },
    ],
  },
};


export function Page() {
  const [selectedCrop, setSelectedCrop] = useState('wheat')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [newActivity, setNewActivity] = useState({ type: '', description: '' })

  const cropData = cropCalendarData[selectedCrop]

  const getEventsForDate = (date: Date) => {
    const events = []
    if (date >= cropData.plantingPeriod.start && date <= cropData.plantingPeriod.end) {
      events.push({ type: 'planting', description: 'Planting period' })
    }
    cropData.fertilizationSchedule.forEach(schedule => {
      if (schedule.date.toDateString() === date.toDateString()) {
        events.push({ type: 'fertilization', description: schedule.description })
      }
    })
    cropData.irrigationNeeds.forEach(need => {
      if (date >= need.start && date <= need.end) {
        events.push({ type: 'irrigation', description: need.description })
      }
    })
    cropData.pestControl.forEach(control => {
      if (control.date.toDateString() === date.toDateString()) {
        events.push({ type: 'pestControl', description: control.description })
      }
    })
    if (date >= cropData.harvestingTimeline.start && date <= cropData.harvestingTimeline.end) {
      events.push({ type: 'harvesting', description: 'Harvesting period' })
    }
    cropData.weatherPatterns.forEach(pattern => {
      if (date >= pattern.start && date <= pattern.end) {
        events.push({ type: 'weather', description: pattern.description })
      }
    })
    return events
  }

  const renderEventBadge = (type: string) => {
    switch (type) {
      case 'planting':
        return <Badge variant="outline" className="bg-green-100 text-green-800"><Sprout className="w-3 h-3 mr-1" /> Planting</Badge>
      case 'fertilization':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800"><Leaf className="w-3 h-3 mr-1" /> Fertilization</Badge>
      case 'irrigation':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800"><Droplet className="w-3 h-3 mr-1" /> Irrigation</Badge>
      case 'pestControl':
        return <Badge variant="outline" className="bg-red-100 text-red-800"><Bug className="w-3 h-3 mr-1" /> Pest Control</Badge>
      case 'harvesting':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800"><Sun className="w-3 h-3 mr-1" /> Harvesting</Badge>
      case 'weather':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800"><Wind className="w-3 h-3 mr-1" /> Weather</Badge>
      default:
        return null
    }
  }

  const handleAddActivity = () => {
    // Here you would typically update your backend or state management
    console.log('New activity:', { date: selectedDate, ...newActivity })
    setNewActivity({ type: '', description: '' })
  }

  return (
    <div className="min-h-screen bg-cover bg-center" style={{backgroundImage: "url('https://img.freepik.com/free-photo/detail-rice-plant-sunset-valencia-with-plantation-out-focus-rice-grains-plant-seed_181624-25838.jpg')"}}>
      <div className="container mx-auto p-4 bg-white/90 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Crop Calendar</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 backdrop-blur-sm bg-white/60 rounded-lg shadow-lg">
            <CardHeader>
              <CardTitle>Calendar Overview</CardTitle>
              <CardDescription>Select a date to view events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select crop" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wheat">Wheat</SelectItem>
                    {/* Add more crops as needed */}
                  </SelectContent>
                </Select>
              </div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
          <Card className="backdrop-blur-sm bg-white/60 rounded-lg shadow-lg">
            <CardHeader>
              <CardTitle>Events for {selectedDate?.toDateString()}</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDate && getEventsForDate(selectedDate).map((event, index) => (
                <div key={index} className="mb-2">
                  {renderEventBadge(event.type)}
                  <p className="mt-1 text-sm">{event.description}</p>
                </div>
              ))}
              {selectedDate && getEventsForDate(selectedDate).length === 0 && (
                <p>No events scheduled for this date.</p>
              )}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full mt-4">
                    <Plus className="mr-2 h-4 w-4" /> Add Activity
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Activity</DialogTitle>
                    <DialogDescription>
                      Add a new activity for {selectedDate?.toDateString()}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="activity-type" className="text-right">
                        Type
                      </Label>
                      <Select value={newActivity.type} onValueChange={(value) => setNewActivity({...newActivity, type: value})}>
                        <SelectTrigger className="w-[180px] col-span-3">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planting">Planting</SelectItem>
                          <SelectItem value="fertilization">Fertilization</SelectItem>
                          <SelectItem value="irrigation">Irrigation</SelectItem>
                          <SelectItem value="pestControl">Pest Control</SelectItem>
                          <SelectItem value="harvesting">Harvesting</SelectItem>
                          <SelectItem value="weather">Weather</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="activity-description" className="text-right">
                        Description
                      </Label>
                      <Input
                        id="activity-description"
                        value={newActivity.description}
                        onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" onClick={handleAddActivity}>
                      Add
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setNewActivity({ type: '', description: '' })}>
                      Cancel
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
