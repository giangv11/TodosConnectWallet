import React from 'react';
import ProtectedRoutes from '../component/ProtectedRoutes';
import { useSelector } from 'react-redux';

function Profile() {
  const { user } = useSelector((state) => state.auth);

  return (
    <ProtectedRoutes>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>
        {user && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="mb-3"><strong className="font-semibold">Name:</strong> {user.name}</p>
            <p className="mb-3"><strong className="font-semibold">Email:</strong> {user.email}</p>
            <p className="mb-3"><strong className="font-semibold">Role:</strong> {user.role}</p>
            <p className="mb-3"><strong className="font-semibold">Email Verified:</strong> {user.isEmailVerified ? 'Yes' : 'No'}</p>
          </div>
        )}
      </div>
    </ProtectedRoutes>
  );
}

export default Profile;
