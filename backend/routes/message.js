import express from "express";
import Message from "../models/Message.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", async (req, res) => {
  console.log("Incoming message:", req.body);
  try {
    const { sender, receiver, content } = req.body;

    if (!sender || !receiver || !content) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const message = new Message({ sender, receiver, content });
    await message.save();

    res.status(201).json(message);
  } catch (error) {
    console.error("Message POST error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:user1Id/:user2Id", protect, async (req, res) => {
  const { user1Id, user2Id } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender: user1Id, receiver: user2Id },
        { sender: user2Id, receiver: user1Id },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name")
      .populate("receiver", "name");

    res.status(200).json(messages);
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
