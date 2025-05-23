import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import { useTheme } from './context/ThemeContext';
import CreatePost from './pages/CreatePost';
import UserSearch from './pages/UserSearch';
import OtherUserProfile from './pages/OtherUserProfile';
import MessagesWrapper from './pages/MessagesWrapper';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

const App = () => {
  const { theme } = useTheme();
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home currentUserId={user?.user?._id} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/edit-profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/search" element={<UserSearch />} />
        <Route path="/profile/:id" element={<OtherUserProfile />} />
        <Route path="/messages/:id" element={<MessagesWrapper />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
