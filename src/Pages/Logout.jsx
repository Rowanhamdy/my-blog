import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">You are not logged in</h2>
        <p className="text-gray-600 mb-6">Please log in to access this page.</p>
        <button
          onClick={handleLoginRedirect}
          className="w-full inline-flex justify-center items-center bg-main hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md shadow transition-colors duration-200"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}
