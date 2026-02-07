import React from 'react';
import ProtectedRoutes from '../component/ProtectedRoutes';
import { useNavigate } from 'react-router-dom';

function Settings() {
  const navigate = useNavigate();

  return (
    <ProtectedRoutes>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        <p className="text-gray-600 mb-6">Settings page coming soon...</p>
        <div className="mt-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 mr-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="px-4 py-2 mr-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Profile
          </button>
          <button
            onClick={() => navigate('/logout')}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </ProtectedRoutes>
  );
}

export default Settings;
