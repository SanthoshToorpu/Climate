"use client"
import React from 'react';
import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();

  const handleNewUser = () => {
    router.push('/Newuser');
  };

  const handleExistingUser = () => {
    router.push('/Dashboard');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <h1 className="text-2xl font-bold mb-6">Welcome! Please select an option:</h1>
      <button
        onClick={handleNewUser}
        className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        New User
      </button>
      <button
        onClick={handleExistingUser}
        className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Existing User
      </button>
    </div>
  );
};

export default Home;
