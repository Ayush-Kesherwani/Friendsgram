import React, { useState } from 'react';
import axios from 'axios';

const Feed = ({ currentUserId, post }) => {
  const [likes, setLikes] = useState(post.likes || []);

  const toggleLike = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/posts/${post._id}/like`, {
        userId: currentUserId,
      });
      setLikes(res.data.likes);
    } catch (err) {
      console.error('Error toggling like', err);
    }
  };

  return (
    <button
      className="text-sm text-blue-600 dark:text-blue-400 mt-2"
      onClick={toggleLike}
    >
      {likes.includes(currentUserId) ? '💙 Unlike' : '🤍 Like'} ({likes.length})
    </button>
  );
};

export default Feed;
