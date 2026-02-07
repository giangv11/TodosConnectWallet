import React from 'react';
import ProtectedRoutes from '../component/ProtectedRoutes';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  return (
    <ProtectedRoutes>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>
        {user && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <p className="mb-3"><strong className="font-semibold">Name:</strong> {user.name}</p>
            <p className="mb-3"><strong className="font-semibold">Email:</strong> {user.email}</p>
            <p className="mb-3"><strong className="font-semibold">Role:</strong> {user.role}</p>
            <p className="mb-3"><strong className="font-semibold">Email Verified:</strong> {user.isEmailVerified ? 'Yes' : 'No'}</p>
          </div>
        )}
        <div className="mt-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 mr-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="px-4 py-2 mr-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Settings
          </button>
          <button
            onClick={() => navigate('/logout')}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
          <button
            onClick={() => navigate('/verifyEmail')}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Verify Email
          </button>
        </div>
      </div>
    </ProtectedRoutes>
  );
}

export default Profile;
