import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { user: authUser, isLoggedIn, logout } = useAuth();
  const user = authUser?.user || authUser;
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow px-6 py-4">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <Link to="/" className="text-lg font-bold dark:text-white">
          FriendsGram
        </Link>

        <button className="md:hidden text-black dark:text-white" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="hidden md:flex items-center space-x-4">
          <Link to="/" className="text-sm dark:text-white">Home</Link>
          {isLoggedIn && (
            <>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email"
                className="p-2 rounded border bg-transparent text-black dark:text-white"
              />
              <button onClick={handleSearch} className="bg-blue-500 text-white px-2 py-2 rounded-full hover:bg-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 50 50">
                  <path d="M 21 3 C 11.6 3 4 10.6 4 20 s 7.6 17 17 17 s 17-7.6 17-17 S 30.4 3 21 3 Z m 0 2 c 8.3 0 15 6.7 15 15 s -6.7 15 -15 15 s -15-6.7 -15-15 s 6.7-15 15-15 Z"/>
                </svg>
              </button>
              <Link to="/create-post" className="text-3xl dark:text-white">+</Link>
              <Link to="/profile">
                <img
                  src={user?.profilePic ? `${import.meta.env.VITE_API_URL}${user.profilePic}` : "/nonpic.jpg"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover"
                />
              </Link>
              <button onClick={logout} className="text-sm text-red-500">Logout</button>
            </>
          )}
          {!isLoggedIn && (
            <>
              <Link to="/login" className="text-sm dark:text-white">Login</Link>
              <Link to="/register" className="text-sm dark:text-white">Register</Link>
            </>
          )}
          <button onClick={toggleTheme} className="text-sm px-1 py-1 rounded bg-gray-200 dark:bg-gray-700 dark:text-white">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-3 dark:text-white">
          <Link to="/" onClick={toggleMenu}>Home</Link>
          {isLoggedIn ? (
            <>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="p-2 rounded border bg-transparent text-black dark:text-white"
              />
              <button onClick={handleSearch} className="bg-blue-500 text-white px-2 py-2 rounded hover:bg-blue-600 w-fit">
                Search
              </button>
              <Link to="/create-post" onClick={toggleMenu}>Create Post</Link>
              <Link to="/profile" onClick={toggleMenu}>
                <img
                  src={user?.profilePic ? `${import.meta.env.VITE_API_URL}${user.profilePic}` : "/nonpic.jpg"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover"
                />
              </Link>
              <button onClick={() => { logout(); toggleMenu(); }} className="text-red-500 w-fit">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={toggleMenu}>Login</Link>
              <Link to="/register" onClick={toggleMenu}>Register</Link>
            </>
          )}
          <button onClick={toggleTheme} className="text-sm px-1 py-1 rounded bg-gray-200 dark:bg-gray-700 dark:text-white w-fit">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
