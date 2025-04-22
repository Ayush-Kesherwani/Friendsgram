<<<<<<< HEAD
import React, { useState } from "react";
=======
import React, { useState, useEffect } from "react";
>>>>>>> 32498628766418ba6b61ec991e3b17054b378932
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
<<<<<<< HEAD
=======
  const user = JSON.parse(localStorage.getItem("user"));
>>>>>>> 32498628766418ba6b61ec991e3b17054b378932
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [verified, setVerified] = useState(false);
<<<<<<< HEAD

=======
  const [loading, setLoading] = useState(false);
>>>>>>> 32498628766418ba6b61ec991e3b17054b378932
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
<<<<<<< HEAD

  const handleSendCode = async () => {
=======

  useEffect(() => {
    if (user?.user?._id) {
      navigate("/profile", { replace: true });
    }
    const storedEmail = localStorage.getItem("pendingEmail");
    if (storedEmail) setEmail(storedEmail);
  }, [user, navigate]);

  const handleSendCode = async () => {
    setLoading(true);
>>>>>>> 32498628766418ba6b61ec991e3b17054b378932
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/verify/send-code`, {
        email,
      });
      alert("Verification code sent to your email");
      setStep(2);
<<<<<<< HEAD
    } catch (error) {
      alert("Failed to send code");
=======
      localStorage.setItem("pendingEmail", email);
    } catch (error) {
      alert("Failed to send code");
    } finally {
      setLoading(false);
>>>>>>> 32498628766418ba6b61ec991e3b17054b378932
    }
  };

  const handleVerifyCode = async () => {
<<<<<<< HEAD
=======
    setLoading(true);
>>>>>>> 32498628766418ba6b61ec991e3b17054b378932
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/verify/verify-code`,
        { email, code }
      );
      if (res.data.success) {
        alert("Email verified successfully!");
        setVerified(true);
        setStep(3);
      } else {
        alert("Invalid code. Please try again.");
      }
    } catch (error) {
      alert("Verification failed");
<<<<<<< HEAD
=======
    } finally {
      setLoading(false);
>>>>>>> 32498628766418ba6b61ec991e3b17054b378932
    }
  };

  const handleRegister = async () => {
<<<<<<< HEAD
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        { name, email, password }
=======
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const finalEmail = email || localStorage.getItem("pendingEmail");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        { name, email:finalEmail, password }
>>>>>>> 32498628766418ba6b61ec991e3b17054b378932
      );
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
<<<<<<< HEAD
      alert("Registration failed. Try again.");
=======
      console.log("Registration error:", err.response?.data || err.message);
      alert("Registration failed. Try again.");
    } finally {
      setLoading(false);
>>>>>>> 32498628766418ba6b61ec991e3b17054b378932
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded shadow">
      {step === 1 && (
        <>
<<<<<<< HEAD
          <h2 className="text-2xl font-bold mb-4">Step 1: Enter Email</h2>
=======
          <h2 className="text-2xl text-white font-bold mb-4">
            Step 1: Enter Email
          </h2>
>>>>>>> 32498628766418ba6b61ec991e3b17054b378932
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full mb-4 p-2 border rounded dark:bg-gray-700 dark:text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={handleSendCode}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
<<<<<<< HEAD
            Send Verification Code
=======
            {loading ? "Sending..." : "Send Verification Code"}
>>>>>>> 32498628766418ba6b61ec991e3b17054b378932
          </button>
        </>
      )}

      {step === 2 && (
        <>
<<<<<<< HEAD
          <h2 className="text-2xl font-bold mb-4">Step 2: Enter Code</h2>
=======
          <h2 className="text-2xl text-white font-bold mb-4">
            Step 2: Enter Code
          </h2>
>>>>>>> 32498628766418ba6b61ec991e3b17054b378932
          <input
            type="text"
            placeholder="Enter 6-digit code"
            className="w-full mb-4 p-2 border rounded dark:bg-gray-700 dark:text-white"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
<<<<<<< HEAD
=======
          <p className="text-red-500 text-sm">Note: Check spams, if not recived mail.</p>
>>>>>>> 32498628766418ba6b61ec991e3b17054b378932
          <button
            onClick={handleVerifyCode}
            className="w-full bg-green-600 text-white py-2 rounded"
          >
<<<<<<< HEAD
            Verify Code
=======
            {loading ? "Verifing..." : "Verify Code"}
>>>>>>> 32498628766418ba6b61ec991e3b17054b378932
          </button>
        </>
      )}

      {step === 3 && verified && (
        <>
<<<<<<< HEAD
          <h2 className="text-2xl font-bold mb-4">Step 3: Complete Registration</h2>
=======
          <h2 className="text-2xl text-white font-bold mb-4">
            Step 3: Complete Registration
          </h2>
>>>>>>> 32498628766418ba6b61ec991e3b17054b378932
          <input
            type="text"
            placeholder="Your name"
            className="w-full mb-4 p-2 border rounded dark:bg-gray-700 dark:text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 p-2 border rounded dark:bg-gray-700 dark:text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleRegister}
            className="w-full bg-purple-600 text-white py-2 rounded"
          >
<<<<<<< HEAD
            Register
=======
            {loading ? "Loading..." : "Register"}
>>>>>>> 32498628766418ba6b61ec991e3b17054b378932
          </button>
        </>
      )}
    </div>
  );
};

export default Register;
