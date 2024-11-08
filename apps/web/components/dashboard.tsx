'use client'

import React, { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Calendar, ChevronRight, Cloud, Droplets, Leaf, Sun, ThermometerSun, Wind } from 'lucide-react'

// Mock data for tasks
const initialTasks = {
  todo: [
    { id: 'task-1', content: 'Apply fertilizer' },
    { id: 'task-2', content: 'Check irrigation system' },
  ],
  inProgress: [
    { id: 'task-3', content: 'Monitor pest activity' },
  ],
  completed: [
    { id: 'task-4', content: 'Prepare soil for next season' },
  ],
}

export function DashboardComponent() {
  const [tasks, setTasks] = useState(initialTasks)
  const [userData, setUserData] = useState({})
  const onDragEnd = (result) => {
    const { source, destination } = result
    if (!destination) return

    const sourceColumn = tasks[source.droppableId]
    const destColumn = tasks[destination.droppableId]
    const [removed] = sourceColumn.splice(source.index, 1)
    destColumn.splice(destination.index, 0, removed)

    setTasks({
      ...tasks,
      [source.droppableId]: sourceColumn,
      [destination.droppableId]: destColumn,
    })
  }
  //fetch api
  useEffect(() => {
    fetch('/api/submit')
      .then(response => response.json())
      .then(data => {
        if (!data.error) {
          setUserData(data)
          
        } else {
          console.error("Error fetching user data:", data.error)
        }
      })
      .catch(error => console.error("Error fetching user data:", error))
  }, [])
  return (
    <div className="min-h-screen bg-green-50">
      <div className="flex">
        {/* Main content */}
        <main className="flex-1 p-8 overflow-auto">
          
          {/* Weather Overview */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-green-800">Today's Weather</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-green-100 border-green-300 shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Temperature</CardTitle>
                  <ThermometerSun className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userData?.temperature}°C</div>
                  <p className="text-xs text-gray-500">Feels like 30°C</p>
                </CardContent>
              </Card>
              <Card className="bg-green-100 border-green-300 shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Humidity</CardTitle>
                  <Droplets className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userData?.humidity}%</div>
                  <p className="text-xs text-gray-500">Optimal for crops</p>
                </CardContent>
              </Card>
              <Card className="bg-green-100 border-green-300 shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Wind</CardTitle>
                  <Wind className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12 km/h</div>
                  <p className="text-xs text-gray-500">North-East</p>
                </CardContent>
              </Card>
              <Card className="bg-green-100 border-green-300 shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rainfall Probability</CardTitle>
                  <Cloud className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">30%</div>
                  <p className="text-xs text-gray-500">Light showers expected</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Alerts */}
          <section className="mb-8">
            <Card className="bg-yellow-50 border-yellow-200 shadow-md">
              <CardHeader>
                <CardTitle className="text-yellow-800">Weather Alert</CardTitle>
                <CardDescription className="text-yellow-700">
                  Heavy rainfall expected in your area over the next 48 hours. Take necessary precautions.
                </CardDescription>
              </CardHeader>
            </Card>
          </section>

          {/* Soil Analysis and Crop Progress */}
          <section className="mb-8">
            <Tabs defaultValue="soil">
              <TabsList>
                <TabsTrigger value="soil" className="bg-green-200">Soil Analysis</TabsTrigger>
                <TabsTrigger value="crop" className="bg-green-200">Crop Progress</TabsTrigger>
              </TabsList>
              <TabsContent value="soil">
                <Card className="bg-white shadow-md">
                  <CardHeader>
                    <CardTitle>Soil Analysis Report</CardTitle>
                    <CardDescription>Last updated: 2 days ago</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">pH Level</span>
                          <span className="text-sm font-medium">{userData?.ph}</span>
                        </div>
                        <Progress value={65} className="h-2 bg-green-400" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Nitrogen (N)</span>
                          <span className="text-sm font-medium">{userData?.N}</span>
                        </div>
                        <Progress value={50} className="h-2 bg-green-400" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Phosphorus (P)</span>
                          <span className="text-sm font-medium">{userData?.P}</span>
                        </div>
                        <Progress value={80} className="h-2 bg-green-400" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Potassium (K)</span>
                          <span className="text-sm font-medium">{userData?.K}</span>
                        </div>
                        <Progress value={30} className="h-2 bg-green-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="crop">
                <Card className="bg-white shadow-md">
                  <CardHeader>
                    <CardTitle>Wheat Crop Progress</CardTitle>
                    <CardDescription>Planted on: March 15, 2023</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Growth Stage</span>
                          <span className="text-sm font-medium">Tillering</span>
                        </div>
                        <Progress value={40} className="h-2 bg-green-400" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Days to Harvest</span>
                          <span className="text-sm font-medium">75 days</span>
                        </div>
                        <Progress value={60} className="h-2 bg-green-400" />
                      </div>
                    </div>
                    <Button className="mt-4 bg-green-600 hover:bg-green-700 text-white">View Crop Calendar</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </section>

        {/* Task Management */}
        <section>
            <h3 className="text-xl font-semibold mb-4 text-green-800">Task Management</h3>
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(tasks).map(([columnId, columnTasks]) => (
                  <div key={columnId}>
                    <h4 className="font-medium mb-2 capitalize text-green-700">{columnId}</h4>
                    <Droppable droppableId={columnId}>
                      {(provided) => (
                        <div                          {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="bg-gray-100 rounded-md p-2"
                      >
                        {columnTasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-white border border-gray-300 rounded-md p-4 mb-2 shadow hover:bg-green-50 transition"
                              >
                                {task.content}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </DragDropContext>
        </section>
      </main>
    </div>
  </div>
)
}
