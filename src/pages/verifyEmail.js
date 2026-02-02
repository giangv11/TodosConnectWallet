import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { verifyEmail } from '../api/authApi';

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const token = searchParams.get('token');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setMessage('Invalid verification token');
        setIsLoading(false);
        return;
      }

      try {
        const response = await verifyEmail(token);
        setMessage(response.message || 'Email verified successfully!');
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } catch (error) {
        setMessage(error.message || 'Verification failed');
      } finally {
        setIsLoading(false);
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="mb-6 text-2xl font-semibold">Email Verification</h2>
        
        {isLoading ? (
          <div className="text-gray-600">Verifying email...</div>
        ) : (
          <>
            <div className={`p-3 rounded mb-4 ${
              message.includes('success')
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {message}
            </div>
            <Link to="/" className="text-blue-600 hover:text-blue-800 no-underline">
              Go to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;
