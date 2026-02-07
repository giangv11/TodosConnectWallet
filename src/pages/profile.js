import React, { useState } from 'react';
import ProtectedRoutes from '../component/ProtectedRoutes';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../store/slices/authSlice';
import { updateProfile } from '../api/userApi';

function Profile() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    userType: user?.userType || 'user',
    bio: user?.bio || '',
    skills: user?.skills?.join(', ') || '',
    walletAddress: user?.walletAddress || '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const skillsArray = formData.skills
        ? formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
        : [];
      
      const response = await updateProfile(user.id, {
        ...formData,
        skills: skillsArray,
      });
      
      dispatch(updateUser(response.data));
      setIsEditing(false);
    } catch (error) {
      alert(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoutes>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Profile</h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>

        {user && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block mb-2 font-medium">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-2 font-medium">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-2 font-medium">User Type</label>
                  <select
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="user">User</option>
                    <option value="freelancer">Freelancer</option>
                    <option value="client">Client</option>
                    <option value="business">Business</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block mb-2 font-medium">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-2 font-medium">Skills (comma-separated)</label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="e.g., React, Node.js, Design"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-2 font-medium">Wallet Address</label>
                  <input
                    type="text"
                    name="walletAddress"
                    value={formData.walletAddress}
                    onChange={handleChange}
                    placeholder="0x..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user?.name || '',
                        phone: user?.phone || '',
                        userType: user?.userType || 'user',
                        bio: user?.bio || '',
                        skills: user?.skills?.join(', ') || '',
                        walletAddress: user?.walletAddress || '',
                      });
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <p className="mb-3"><strong className="font-semibold">Name:</strong> {user.name}</p>
                <p className="mb-3"><strong className="font-semibold">Email:</strong> {user.email}</p>
                <p className="mb-3"><strong className="font-semibold">Phone:</strong> {user.phone || 'Not set'}</p>
                <p className="mb-3"><strong className="font-semibold">User Type:</strong> {user.userType || 'user'}</p>
                <p className="mb-3"><strong className="font-semibold">Role:</strong> {user.role}</p>
                <p className="mb-3"><strong className="font-semibold">Email Verified:</strong> {user.isEmailVerified ? 'Yes' : 'No'}</p>
                {user.bio && (
                  <p className="mb-3"><strong className="font-semibold">Bio:</strong> {user.bio}</p>
                )}
                {user.skills && user.skills.length > 0 && (
                  <p className="mb-3"><strong className="font-semibold">Skills:</strong> {user.skills.join(', ')}</p>
                )}
                {user.walletAddress && (
                  <p className="mb-3"><strong className="font-semibold">Wallet Address:</strong> {user.walletAddress}</p>
                )}
              </>
            )}
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

export default Profile;
