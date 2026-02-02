import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';

function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(logout());
    navigate('/');
  }, [dispatch, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-gray-600">Logging out...</div>
    </div>
  );
}

export default Logout;
