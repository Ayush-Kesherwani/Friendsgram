import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const token = user?.token;
  const userId = user?.user?._id;

  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");

  useEffect(() => {
    setName(user?.name || "");
    setBio(user?.bio || "");
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
  
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/edit/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, bio }),
    });
  
    if (res.ok) {
      const updatedUser = await res.json();
  
      const newUserData = {
        user: updatedUser,
        token: token,
      };
  
      localStorage.setItem("user", JSON.stringify(newUserData));
      setUser(newUserData);
  
      alert("Profile updated!");
      navigate("/profile");
    } else {
      const error = await res.json();
      console.error("Update failed:", error);
    }
  };

  const handleCancel = () => navigate("/profile");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form
        onSubmit={handleUpdate}
        className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl mb-4 font-semibold">Edit Profile</h2>

        <label className="block mb-2">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
        />

        <label className="block mb-2">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
        />

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
