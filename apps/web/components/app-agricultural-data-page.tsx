"use client";

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Leaf,
  Thermometer,
  Droplets,
  Beaker,
  Calendar,
  CloudRain,
  Trash2,
} from 'lucide-react';

export function FormPage() {
  const initialFormData = {
    username: '',
    phoneNumber: '',
    N: '',
    P: '',
    K: '',
    temperature: '',
    humidity: '',
    ph: '',
    durationMonths: '',
    rainfall: '',
    city: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFetchWeather = async () => {
    if (!formData.city) {
      alert("Please enter a city name.");
      return;
    }

    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${formData.city}&appid=e227909b61596bb0bbad12df00e62572&units=metric`);
      if (!response.ok) throw new Error('Failed to fetch weather data');
      
      const data = await response.json();
      const { main } = data;

      setFormData((prevState) => ({
        ...prevState,
        temperature: main.temp,
        humidity: main.humidity,
      }));
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert necessary fields to numbers
    const payload = {
      username: formData.username,
      phoneNumber: formData.phoneNumber,
      N: parseFloat(formData.N),
      P: parseFloat(formData.P),
      K: parseFloat(formData.K),
      temperature: parseFloat(formData.temperature),
      humidity: parseFloat(formData.humidity),
      ph: parseFloat(formData.ph),
      durationmonths: parseFloat(formData.durationMonths), // adjusting key for backend compatibility
      rainfall: parseFloat(formData.rainfall),
      city: formData.city,
    };

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to submit data');
      const result = await response.json();
      console.log('Data added successfully:', result);
      handleClearData(); // Clear form after successful submission
    } catch (error) {
      console.error('Error adding data:', error);
    }
  };

  const handleClearData = () => {
    setFormData(initialFormData);
  };

  return (
    <div className="min-h-screen bg-cover bg-center p-6">
      <Card className="max-w-2xl mx-auto bg-white/95 shadow-lg">
        <CardHeader className="bg-green-100 rounded-t-lg">
          <CardTitle className="text-3xl font-bold text-green-800 flex items-center justify-center">
            <Leaf className="mr-2 h-8 w-8" />
            Agricultural Data Input
          </CardTitle>
          <CardDescription className="text-center text-green-600">
            Please enter the following agricultural data for analysis
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            {/* City Input */}
            <div className="space-y-2">
              <Label htmlFor="city" className="text-green-700">City</Label>
              <Input
                id="city"
                name="city"
                placeholder="Enter city name"
                value={formData.city}
                onChange={handleInputChange}
                className="border-green-200 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            {/* Fetch Weather Button */}
            <Button
              type="button"
              onClick={handleFetchWeather}
              className="bg-black hover:bg-green-700 text-white"
            >
              Fetch Weather Data
            </Button>

            {/* Temperature and Humidity Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-green-700 flex items-center">
                  <Thermometer className="mr-2 h-4 w-4" /> Temperature (°C)
                </Label>
                <Input
                  id="temperature"
                  name="temperature"
                  placeholder="Temperature"
                  value={formData.temperature}
                  onChange={handleInputChange}
                  className="border-green-200 focus:border-green-500 focus:ring-green-500"
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label className="text-green-700 flex items-center">
                  <Droplets className="mr-2 h-4 w-4" /> Humidity (%)
                </Label>
                <Input
                  id="humidity"
                  name="humidity"
                  placeholder="Humidity"
                  value={formData.humidity}
                  onChange={handleInputChange}
                  className="border-green-200 focus:border-green-500 focus:ring-green-500"
                  readOnly
                />
              </div>
            </div>

            {/* Other Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-green-700">Username</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="border-green-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-green-700">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Enter phone number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="border-green-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              {/* N, P, K Inputs */}
              <div className="space-y-2">
                <Label htmlFor="N" className="text-green-700 flex items-center">
                  <Leaf className="mr-2 h-4 w-4" /> Nitrogen (N)
                </Label>
                <Input
                  id="N"
                  name="N"
                  placeholder="Enter N value"
                  value={formData.N}
                  onChange={handleInputChange}
                  className="border-green-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="P" className="text-green-700 flex items-center">
                  <Leaf className="mr-2 h-4 w-4" /> Phosphorus (P)
                </Label>
                <Input
                  id="P"
                  name="P"
                  placeholder="Enter P value"
                  value={formData.P}
                  onChange={handleInputChange}
                  className="border-green-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="K" className="text-green-700 flex items-center">
                  <Leaf className="mr-2 h-4 w-4" /> Potassium (K)
                </Label>
                <Input
                  id="K"
                  name="K"
                  placeholder="Enter K value"
                  value={formData.K}
                  onChange={handleInputChange}
                  className="border-green-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              {/* pH Level Input */}
              <div className="space-y-2">
                <Label htmlFor="ph" className="text-green-700 flex items-center">
                  <Beaker className="mr-2 h-4 w-4" /> pH Level
                </Label>
                <Input
                  id="ph"
                  name="ph"
                  placeholder="Enter pH level"
                  value={formData.ph}
                  onChange={handleInputChange}
                  className="border-green-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>
                            {/* Duration Months Input */}
                            <div className="space-y-2">
              <Label htmlFor="durationMonths" className="text-green-700 flex items-center">
                <Calendar className="mr-2 h-4 w-4" /> Duration (Months)
              </Label>
              <select
                id="durationMonths"
                name="durationMonths"
                value={formData.durationMonths}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-green-200 focus:border-green-500 focus:ring-green-500"
              >
                <option value="">Select duration</option>
                <option value="3">3 months</option>
                <option value="6">6 months</option>
                <option value="12">12 months</option>
                <option value="24">24 months</option>
                <option value="48">48 months</option>
                <option value="72">72 months</option>
                <option value="120">120 months</option>
              </select>
            </div>

              {/* Rainfall Input */}
              <div className="space-y-2">
                <Label htmlFor="rainfall" className="text-green-700 flex items-center">
                  <CloudRain className="mr-2 h-4 w-4" /> Rainfall (mm)
                </Label>
                <Input
                  id="rainfall"
                  name="rainfall"
                  placeholder="Enter rainfall amount"
                  value={formData.rainfall}
                  onChange={handleInputChange}
                  className="border-green-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between p-6 bg-green-100 rounded-b-lg">
            <Button type="button" onClick={handleClearData} className="bg-red-600 hover:bg-red-700 text-white">
              Clear
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
              Submit
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
