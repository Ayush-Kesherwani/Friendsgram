import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user: authUser } = useAuth();
  const user = authUser?.user || authUser;
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  useEffect(() => {
    // if (!user) navigate("/login");
  }, [user, navigate]);

  const fetchPosts = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/posts/user/${user?._id}`
      );
      const data = await res.json();
      setUserPosts(data);
    } catch (error) {
      console.error("Failed to fetch user posts:", error);
    }
  };

  useEffect(() => {
    if (user?._id) fetchPosts();
    console.log("User Followers:", user.followers);
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("profilePic", selectedFile);

    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/upload-profile-pic/${user?._id}`,
        {
          method: "POST",
          body: formData,
        }
      );
      alert("Profile picture updated");
      window.location.reload();
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}`, {
        method: "DELETE",
      });
      setUserPosts((prev) => prev.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleEdit = async (postId, currentCaption) => {
    const newCaption = prompt("Edit your caption:", currentCaption);
    if (newCaption === null || newCaption.trim() === "") return;

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ caption: newCaption }),
      });
      fetchPosts();
    } catch (error) {
      console.error("Edit failed:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Profile</h1>

      <div className="flex flex-col items-center mb-10">
        <div
          className="relative w-36 h-36 cursor-pointer group"
          onClick={handleImageClick}
        >
          <img
            src={user?.user?.profilePicture || "/nonpic.jpg"}
            alt="Profile"
            className="w-full h-full rounded-full object-cover border-4 border-blue-500 shadow-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition">
            <span className="text-white text-sm font-medium">
              Change Picture
            </span>
          </div>
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
        />
        {selectedFile && (
          <button
            onClick={handleUpload}
            className="mt-4 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Upload New Picture
          </button>
        )}
      </div>

      <div className="text-sm text-gray-500 mt-1 flex gap-4">
        <button onClick={() => setShowFollowers(true)}>
          {user.followers?.length || 0} Followers
        </button>
        <button onClick={() => setShowFollowing(true)}>
          {user.following?.length || 0} Following
        </button>
      </div>

      {showFollowers && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-black rounded p-4 max-w-md w-full">
            <h2 className="text-xl font-bold mb-2">Followers</h2>
            <ul>
              {user.followers.map((follower) => (
                <li
                  key={follower._id}
                  className="flex text-white items-center gap-2 border-b py-2"
                >
                  <img
                    src={`${import.meta.env.VITE_API_URL}${
                      follower?.profilePicture
                    }`}
                    className="w-8 h-8 rounded-full"
                  />
                  <Link
                    to={`/profile/${follower._id}`}
                    className="hover:underline"
                  >
                    {follower?.name || 'Unname'}
                  </Link>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowFollowers(false)}
              className="mt-4 text-sm text-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showFollowing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-black rounded p-4 max-w-md w-full">
            <h2 className="text-xl font-bold mb-2">Following</h2>
            <ul>
              {user.following.map((followingUser) => (
                <li
                  key={followingUser._id}
                  className="flex items-center gap-2 border-b py-2"
                >
                  <img
                    src={`${import.meta.env.VITE_API_URL}${
                      followingUser.profilePicture
                    }`}
                    className="w-8 h-8 rounded-full"
                  />
                  <Link
                    to={`/profile/${followingUser._id}`}
                    className="hover:underline"
                  >
                    {followingUser.name || 'Unname'}
                  </Link>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowFollowing(false)}
              className="mt-4 text-sm text-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="mb-10 text-center">
        <p className="text-lg font-semibold">
          Name: <span className="font-normal">{user?.name}</span>
        </p>
        <p className="text-lg font-semibold">
          Email: <span className="font-normal">{user?.email}</span>
        </p>
        <p className="text-lg font-normal">{user?.bio}</p>
      </div>

      <Link
        to="/edit-profile"
        className="text-blue-600 mt-4 block text-center hover:underline"
      >
        Edit Profile
      </Link>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Your Posts</h2>
        {userPosts.length === 0 ? (
          <p className="text-gray-500">You haven't posted anything yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userPosts.map((post) => (
              <div
                key={post._id}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
              >
                <p className="mb-2 text-gray-700 dark:text-gray-200">
                  {post.caption}
                </p>
                {post.mediaType === "image" ? (
                  <img
                    src={post.mediaPath}
                    alt="post"
                    className="w-full max-h-[500px] object-cover rounded"
                  />
                ) : (
                  <video
                    src={post.mediaPath}
                    controls
                    className="w-full max-h-[500px] rounded"
                  />
                )}
                <p className="mt-2 text-sm text-gray-500">
                  Posted on {new Date(post.createdAt).toLocaleString()}
                </p>

                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => handleEdit(post._id, post.caption)}
                    className="px-3 py-1 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
