import React, { useEffect, useState } from "react";
import axios from "axios";
import Feed from "./Feed";

const Home = ({ currentUserId }) => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [newComments, setNewComments] = useState({});

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/posts`);
        const data = await res.json();
        setPosts(data);

        const commentData = {};
        for (const post of data) {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/posts/${post._id}/comments`
          );
          commentData[post._id] = res.data;
        }
        setComments(commentData);
      } catch (err) {
        console.error("Failed to fetch posts or comments:", err);
      }
    };

    fetchPosts();
  }, []);

  const handleCommentChange = (postId, text) => {
    setNewComments({ ...newComments, [postId]: text });
  };

  const handleCommentSubmit = async (postId) => {
    try {
      const commentText = newComments[postId];
      if (!commentText) return;

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/posts/${postId}/comments`,
        {
          userId: currentUserId,
          text: commentText,
        }
      );

      setComments({
        ...comments,
        [postId]: [...(comments[postId] || []), res.data.comment],
      });

      setNewComments({ ...newComments, [postId]: "" });
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  const handleDeleteComment = async (commentId, postId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/posts/${postId}/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { userId: currentUserId },
        }
      );

      setComments({
        ...comments,
        [postId]: comments[postId].filter((c) => c._id !== commentId),
      });
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Feed</h1>
      {posts.length === 0 ? (
        <p className="text-gray-500 text-center">No posts yet</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white dark:bg-gray-800 p-4 rounded shadow-md border dark:border-gray-700"
            >
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={
                    post.userId?.profilePic
                      ? `${import.meta.env.VITE_API_URL}${
                          post.userId.profilePic
                        }`
                      : "/nonpic.jpg"
                  }
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover border border-gray-300"
                />
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {post.userId?.name || "Unknown User"}
                </p>
              </div>
              <p className="mb-2 text-gray-700 dark:text-gray-200">
                {post.caption}
              </p>
              {post.mediaType === "image" ? (
                <img
                  src={`${import.meta.env.VITE_API_URL}${post.mediaPath}`}
                  alt="post"
                  className="w-full max-h-[500px] object-cover rounded"
                />
              ) : (
                <video
                  src={`${import.meta.env.VITE_API_URL}${post.mediaPath}`}
                  controls
                  className="w-full max-h-[500px] rounded"
                />
              )}
              <Feed currentUserId={currentUserId} post={post} />
              <p className="mt-2 text-sm text-gray-500">
                Posted on {new Date(post.createdAt).toLocaleString()}
              </p>

              {/* Comment Section */}
              <div className="mt-4">
                <input
                  type="text"
                  value={newComments[post._id] || ""}
                  onChange={(e) =>
                    handleCommentChange(post._id, e.target.value)
                  }
                  placeholder="Write a comment..."
                  className="w-full p-2 rounded border dark:bg-gray-700 dark:text-white"
                />
                <button
                  onClick={() => handleCommentSubmit(post._id)}
                  className="mt-2 text-sm bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                >
                  Comment
                </button>
                <div className="mt-3 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  {(comments[post._id] || []).map((c, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <p>
                        <span className="font-medium text-blue-600 dark:text-blue-400">
                          {c.userId?.name || "Anonymous"}:
                        </span>{" "}
                        {c.text}
                      </p>
                      {String(c.userId?._id) === String(currentUserId) && (
                        <button
                          onClick={() => handleDeleteComment(c._id, post._id)}
                          className="text-xs text-red-500 ml-4"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
