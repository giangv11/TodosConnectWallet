import apiRequest from './apiConfig';

// Update user profile
export const updateProfile = async (userId, profileData) => {
  return await apiRequest(`/users/${userId}`, {
    method: 'PUT',
    body: profileData,
  });
};

// Get user by ID
export const getUserById = async (userId) => {
  return await apiRequest(`/users/${userId}`);
};
