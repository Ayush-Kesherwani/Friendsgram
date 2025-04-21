import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (user?.user?._id) {
      navigate("/profile", { replace: true });
    }
    const storedEmail = localStorage.getItem("pendingEmail");
    if (storedEmail) setEmail(storedEmail);
  }, [user, navigate]);

  const handleSendCode = async () => {
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/verify/send-code`, {
        email,
      });
      alert("Verification code sent to your email");
      setStep(2);
      localStorage.setItem("pendingEmail", email);
    } catch (error) {
      alert("Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
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
      );
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      console.log("Registration error:", err.response?.data || err.message);
      alert("Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded shadow">
      {step === 1 && (
        <>
          <h2 className="text-2xl text-white font-bold mb-4">
            Step 1: Enter Email
          </h2>
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
            {loading ? "Sending..." : "Send Verification Code"}
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="text-2xl text-white font-bold mb-4">
            Step 2: Enter Code
          </h2>
          <input
            type="text"
            placeholder="Enter 6-digit code"
            className="w-full mb-4 p-2 border rounded dark:bg-gray-700 dark:text-white"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button
            onClick={handleVerifyCode}
            className="w-full bg-green-600 text-white py-2 rounded"
          >
            {loading ? "Verifing..." : "Verify Code"}
          </button>
        </>
      )}

      {step === 3 && verified && (
        <>
          <h2 className="text-2xl text-white font-bold mb-4">
            Step 3: Complete Registration
          </h2>
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
            {loading ? "Loading..." : "Register"}
          </button>
        </>
      )}
    </div>
  );
};

export default Register;
