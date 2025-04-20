import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const OtherUserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const isOwnProfile = currentUser?.user?._id === user?._id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, postsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/users/${id}`),
          axios.get(`${import.meta.env.VITE_API_URL}/posts/user/${id}`),
        ]);

        setUser(userRes.data);
        setPosts(postsRes.data);

        if (currentUser?.user?._id && Array.isArray(userRes.data.followers)) {
          setIsFollowing(userRes.data.followers.includes(currentUser.user._id));
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data.");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleFollowToggle = async () => {
    if (!token) {
      alert("You must be logged in to follow/unfollow.");
      return;
    }

    try {
      const url = `${import.meta.env.VITE_API_URL}/api/users/${
        isFollowing ? "unfollow" : "follow"
      }/${id}`;

      const res = await axios.put(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsFollowing(!isFollowing);
      setUser(res.data.user);
    } catch (err) {
      console.error("Error following/unfollowing user:", err);
      alert("Failed to update follow status.");
    }
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-500">Loading profile...</p>
    );
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!user)
    return <p className="text-center mt-10 text-gray-500">User not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center gap-4 mb-6">
        <img
          src={`${import.meta.env.VITE_API_URL}${user.profilePic}`}
          alt={user.name}
          className="w-20 h-20 rounded-full object-cover border"
        />
        <div>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
          <p className="text-sm text-gray-500">{user.bio}</p>
          <div className="text-sm text-gray-500 mt-1">
            <span>{user.followers?.length || 0} Followers</span> ·{" "}
            <span>{user.following?.length || 0} Following</span>
          </div>
        </div>
      </div>

      {!isOwnProfile && currentUser?.user?._id && (
        <>
          <button
            onClick={handleFollowToggle}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
          <Link
            to={`/messages/${id}`}
            className="ml-4 px-4 py-2 border rounded text-blue-600 hover:underline"
          >
            Message
          </Link>
        </>
      )}

      <hr className="my-4" />

      <h3 className="text-lg font-semibold mb-3">Posts</h3>
      {posts.length === 0 ? (
        <p className="text-gray-500">No posts to show.</p>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white dark:bg-gray-800 p-4 rounded shadow border dark:border-gray-700"
            >
              <p className="text-gray-700 dark:text-gray-200 mb-2">
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OtherUserProfile;
