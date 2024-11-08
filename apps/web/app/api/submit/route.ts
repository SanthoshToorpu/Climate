// app/api/suggest-crops/route.ts

import { NextResponse } from 'next/server';
import prisma from '../../../../../packages/db/index';

export async function POST(req: Request) {
  const url = 'http://127.0.0.1:8000/suggest_crops';

  try {
    // Parse the JSON data from the request body
    const data = await req.json();

    // Make the POST request to the external API with the incoming data
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    // Check if the response is successful
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch data from external API' }, { status: response.status });
    }

    // Parse and return the response from the external API
    const result = await response.json();

    // Store the received crop data in the User model
    await prisma.user.create({
      data: {
        username: data.username, // Ensure this field is included in the request
        phoneNumber: data.phoneNumber,
        crops: result.top_3_crops, // Assuming result contains crops
        N: data.N,
        P: data.P,
        K: data.K,
        temperature: data.temperature,
        humidity: data.humidity,
        ph: data.ph,
        durationMonths: data.durationmonths,
        rainfall: data.rainfall,
        city: data.city,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error making POST request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const user = await prisma.user.findFirst();

    if (!user) {
      return NextResponse.json({ error: 'No user found' }, { status: 404, headers });
    }

    return NextResponse.json(user, { headers });
  } catch (error) {
    console.error('Error fetching user details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500, headers });
  }
}

export async function PUT(req: Request) {
  try {
    // Parse the JSON data from the request body to get the selected crop
    const { selectedcrop } = await req.json();

    // Find the first user
    const user = await prisma.user.findFirst();

    if (!user) {
      return NextResponse.json({ error: 'No user found to update' }, { status: 404 });
    }

    // Update the selected crop for the found user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { selectedcrop },
    });

    return NextResponse.json({ message: 'User crop selection updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user selected crop:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}