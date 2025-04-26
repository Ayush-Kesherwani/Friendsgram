import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";

const Messages = ({ receiverId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const lastMessageIdRef = useRef(null);

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const showNotification = (msg) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(`New message from ${msg.sender.name}`, {
        body: msg.content,
      });
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/messages/${user.user._id}/${receiverId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch messages");

      const data = await res.json();

      if (Array.isArray(data)) {
        const latestMsg = data[data.length - 1];

        // 🔔 Check if new message arrived & not from current user
        if (
          latestMsg &&
          latestMsg._id !== lastMessageIdRef.current &&
          latestMsg.sender._id !== user.user._id
        ) {
          showNotification(latestMsg);
          lastMessageIdRef.current = latestMsg._id;
        }

        setMessages(data);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error("Error fetching messages:", err.message);
      setMessages([]);
    }
  };

  const sendMessage = async () => {
    if (!content.trim()) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          sender: user?.user?._id,
          receiver: receiverId,
          content,
        }),
      });

      const newMessage = await res.json();
      setMessages((prev) => [...prev, newMessage]);
      setContent("");
      lastMessageIdRef.current = newMessage._id; // ⏱ Update tracker
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  useEffect(() => {
    fetchMessages(); // initial fetch
    const interval = setInterval(fetchMessages, 1000);
    return () => clearInterval(interval);
  }, [user, receiverId]);

  return (
    <div className="max-w-md mx-auto mt-6 p-4 border rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-center">Chat</h2>
      <div className="h-64 overflow-y-auto border p-2 rounded mb-3 bg-white text-black flex flex-col">
        {messages.map((msg) => {
          const isSender = msg.sender?._id === user?.user?._id;
          return (
            <div
              key={msg._id || Math.random()}
              className={`mb-2 p-2 rounded ${
                isSender
                  ? "bg-blue-500 text-white self-end ml-auto max-w-[75%]"
                  : "bg-gray-200 text-black self-start mr-auto max-w-[75%]"
              }`}
            >
              <p className="text-sm">
                {msg.sender.name}: {msg.content}
              </p>
              <p className="text-xs text-right">
                {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : ""}
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border px-3 py-1 rounded text-black"
          placeholder="Type your message"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Messages;
