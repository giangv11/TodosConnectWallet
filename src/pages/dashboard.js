import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCurrentUser } from '../store/slices/authSlice';
import ProtectedRoutes from '../component/ProtectedRoutes';

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, isAuthenticated, user]);

  return (
    <ProtectedRoutes>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        {user && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <p className="text-xl mb-2">Welcome, {user.name}!</p>
            <p className="text-gray-600 mb-1">Email: {user.email}</p>
            <p className="text-gray-600">Role: {user.role}</p>
          </div>
        )}
        <div className="mt-8">
          <button
            onClick={() => navigate('/profile')}
            className="px-4 py-2 mr-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Profile
          </button>
          <button
            onClick={() => navigate('/wallet')}
            className="px-4 py-2 mr-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Connect Wallet
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
        </div>
      </div>
    </ProtectedRoutes>
  );
}

export default Dashboard;
