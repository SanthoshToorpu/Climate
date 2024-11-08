'use client'
// Import dependencies at the top
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const CropAnalysisPage = () => {
  const [userData, setUserData] = useState(null);
  const [cropAnalysis, setCropAnalysis] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from the local API
  const fetchUserData = async () => {
    try {
      const response = await axios.get("/api/submit");
      const userData = response.data;
      setUserData(userData);
      return userData;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  // Fetch crop analysis data from Gemini API
  const fetchCropAnalysis = async (userData) => {
    if (!userData) return;

    const { username, crops, city, ...landDetails } = userData;
    const promptText = `
      For the following crops: ${crops.join(", ")}.
      Provide an analysis with these key details in INR: Economic Cost, Expected Benefits, Ease of Cultivation, Suitability to Local Climate, and Key Risk Factors.
      Format the response as JSON without extra text in the following structure:
      [
        {
          "crop": "Crop Name",
          "economicCost": { "initialSetup": "INR amount", "maintenance": "INR amount per year" },
          "expectedBenefits": { "yield": "tonnes per hectare", "marketValue": "INR per kg" },
          "easeOfCultivation": "Description",
          "suitabilityToLocalClimate": "Description",
          "keyRiskFactors": ["Risk 1", "Risk 2"]
        }
      ]

      return just the json object without any other data or explanations give proper currency formatting with commas and try giving similar responses for similar crops also dont give a steady figure give me a range which has a % variation i.e if the answer is 1,00,000 then give a range with 1,00,000 +- 10,000
    `;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCg_BJDs_peYZc9TZQ25CM2-ubk8fpSSu4`;
    const data = {
      contents: [
        {
          parts: [
            {
              text: promptText
            }
          ]
        }
      ]
    };

    try {
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const responseText = response.data.candidates[0].content.parts[0].text;
      const cleanedText = responseText.replace(/```json|```/g, '').trim();
      const parsedAnalysis = JSON.parse(cleanedText);
      setCropAnalysis(parsedAnalysis);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching crop analysis:", error);
      setCropAnalysis([{ error: "Error fetching analysis from Gemini API." }]);
      setLoading(false);
    }
  };

  // POST request to finalize selected crop
  const finalizeSelection = async () => {
    if (!selectedCrop) {
      alert("Please select a crop before finalizing.");
      return;
    }
  
    try {
      const response = await axios.put("/api/submit", { selectedcrop: selectedCrop });
      alert(`Crop selection finalized: ${selectedCrop}`);
    } catch (error) {
      console.error("Error finalizing crop selection:", error);
      alert("Error finalizing selection. Please try again.");
    }
  };
  
  // Fetch user data and crop analysis on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const userData = await fetchUserData();
      if (userData) {
        await fetchCropAnalysis(userData);
      } else {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Price trend chart configuration for "Apple" (mocked data)
  const chartData = {
    labels: ["2022-01", "2022-02", "2022-03", "2022-04", "2022-05"], // Sample months
    datasets: [
      {
        label: 'Price (INR)',
        data: [3598.36, 3755.11, 4370.23, 6194.37, 7595.66], // Sample prices
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Price Trends for Apple' },
    },
  };

  if (loading) return <Loader className="animate-spin text-center mt-10" />;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-gray-800">Crop Analysis</h1>

      {cropAnalysis.length > 0 && !cropAnalysis[0].error ? (
        cropAnalysis.map((crop, index) => (
          <Card key={index} className={`w-full mx-auto bg-white shadow-md rounded-lg border border-gray-200 mb-6 ${selectedCrop === crop.crop ? 'border-blue-500' : ''}`}>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-800">{crop.crop}</CardTitle>
              <CardDescription className="text-gray-600 italic">Analysis for {crop.crop}</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Existing crop analysis content */}
              <div className="space-y-4">
                <div>
                  <p className="text-lg font-medium text-gray-700">Economic Cost (INR):</p>
                  <ul className="list-disc ml-5">
                    {Object.entries(crop.economicCost).map(([key, value]) => (
                      <li key={key} className="text-sm text-gray-700">
                        <strong>{key.replace(/([A-Z])/g, ' $1')}:</strong> {value}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-700">Expected Benefits (INR):</p>
                  <ul className="list-disc ml-5">
                    {Object.entries(crop.expectedBenefits).map(([key, value]) => (
                      <li key={key} className="text-sm text-gray-700">
                        <strong>{key.replace(/([A-Z])/g, ' $1')}:</strong> {value}
                      </li>
                    ))}
                  </ul>
                </div>
                <p><span className="font-medium text-lg text-gray-700">Ease of Cultivation:</span> {crop.easeOfCultivation}</p>
                <p><span className="font-medium text-lg text-gray-700">Suitability to Local Climate:</span> {crop.suitabilityToLocalClimate}</p>
                <div>
                  <p className="text-lg font-medium text-gray-700">Key Risk Factors:</p>
                  <ul className="list-disc ml-5">
                    {crop.keyRiskFactors.map((risk, idx) => (
                      <li key={idx} className="text-gray-700">{risk}</li>
                    ))}
                  </ul>
                </div>
              </div>
              {/* Price trend chart for Apple */}
              <div className="my-6">
                <Line data={chartData} options={chartOptions} />
              </div>
              <Button
                className={`mt-4 ${selectedCrop === crop.crop ? 'bg-green-600' : 'bg-green-500'} text-white font-semibold rounded-md hover:bg-green-700`}
                onClick={() => setSelectedCrop(crop?.crop)}
              >
                {selectedCrop === crop?.crop ? "Selected" : `Select ${crop?.crop}`}
              </Button>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center">
          <p className="text-lg font-semibold text-red-500">No crop analysis available.</p>
          {cropAnalysis[0]?.error && <p className="text-gray-600">{cropAnalysis[0]?.error}</p>}
        </div>
      )}

      <div className="text-center mt-8">
        <Button
          variant="outline"
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600"
          onClick={finalizeSelection}
        >
          Finalize Crop Decision
        </Button>
      </div>
    </div>
  );
};
