import React, { useState } from 'react';
import axios from 'axios';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleChangePassword = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/change-password`, {
        currentPassword,
        newPassword,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error changing password');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
      <input
        type="password"
        placeholder="Current Password"
        className="w-full p-2 border mb-2 text-black"
        value={currentPassword}
        onChange={e => setCurrentPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="New Password"
        className="w-full p-2 border mb-2 text-black"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
      />
      <button onClick={handleChangePassword} className="bg-blue-600 text-white px-4 py-2 rounded">
        Change Password
      </button>
      {message && <p className="mt-3 text-red-500">{message}</p>}
    </div>
  );
};

export default ChangePassword;
