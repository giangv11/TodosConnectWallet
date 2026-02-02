import React from 'react';
import ProtectedRoutes from '../component/ProtectedRoutes';

function Settings() {
  return (
    <ProtectedRoutes>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        <p className="text-gray-600">Settings page coming soon...</p>
      </div>
    </ProtectedRoutes>
  );
}

export default Settings;
