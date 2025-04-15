import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const UserSearch = () => {
  const [results, setResults] = useState([]);
  const { search } = useLocation();
  const query = new URLSearchParams(search).get('q');

  const rawUser = localStorage.getItem("user");
const currentUser = rawUser ? JSON.parse(rawUser) : null;

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/search?q=${query}`);
        setResults(res.data);
      } catch (err) {
        console.error('Error searching users:', err);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Search Results for: "{query}"</h2>
      {results.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <ul className="space-y-3">
          {results.map((user) => {
            const isCurrentUser = currentUser && currentUser._id === user._id;
            return (
              <li key={user._id}>
                <Link
                  to={isCurrentUser ? '/profile' : `/profile/${user._id}`}
                  className="flex items-center gap-4 p-3 rounded bg-white dark:bg-gray-800 border hover:shadow transition"
                >
                  <img
                    src={`${import.meta.env.VITE_API_URL}${user.profilePic}`}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover border"
                  />
                  <div>
                    <p className="text-lg font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default UserSearch;