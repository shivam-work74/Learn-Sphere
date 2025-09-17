// src/pages/ProfilePage.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios'; // 1. Import our new API client instead of axios
import toast from 'react-hot-toast';

function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      };
      // 2. Use 'API' for the request
      const { data } = await API.post('/api/upload', formData, config);
      setAvatar(data.imageUrl);
      toast.success('Image ready to be saved.');
    } catch (error) {
      toast.error('Image upload failed.');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      // 2. Use 'API' for the request
      const { data } = await API.put('/api/users/profile', { name, avatar }, config);
      updateUser(data);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Error updating profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md space-y-6">
        <div className="flex flex-col items-center">
          <img
            src={avatar || 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'}
            alt="Avatar"
            className="w-32 h-32 rounded-full object-cover mb-4"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Change Picture
          </label>
          <input id="image-upload" type="file" onChange={uploadFileHandler} className="hidden" />
          {uploading && <div className="dark:text-white mt-2">Uploading...</div>}
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}

export default ProfilePage;