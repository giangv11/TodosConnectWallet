import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../api/authApi';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setMessage('Invalid reset token');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      await resetPassword(token, password);
      setMessage('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setMessage(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600">Invalid reset token</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-center mb-6 text-2xl font-semibold">Reset Password</h2>
        
        {message && (
          <div className={`p-3 rounded mb-4 ${
            message.includes('error') || message.includes('Invalid')
              ? 'bg-red-100 text-red-700'
              : 'bg-green-100 text-green-700'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-medium">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 bg-green-600 text-white rounded-md text-base font-medium transition-opacity ${
              isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-green-700 cursor-pointer'
            }`}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/" className="text-blue-600 hover:text-blue-800 no-underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
