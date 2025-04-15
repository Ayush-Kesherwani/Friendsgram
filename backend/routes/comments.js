import express from "express";
import Comment from "../models/Comment.js";

const router = express.Router();

router.post("/:postId/comments", async (req, res) => {
  try {
    const { userId, text } = req.body;
    let comment = await Comment.create({
      postId: req.params.postId,
      userId,
      text,
    });
    
    // Populate the user name before sending it back
    comment = await comment.populate("userId", "name");
    
    res.status(201).json({ message: "Comment added", comment });
    
    res.status(201).json({ message: "Comment added", comment });
  } catch (err) {
    res.status(500).json({ error: "Error adding comment" });
  }
});

router.get("/:postId/comments", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .sort({ createdAt: 1 })
      .populate("userId", "name"); // populate name only
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: "Error fetching comments" });
  }
});

// DELETE a comment
router.delete('/:postId/comments/:commentId', async (req, res) => {
  const { userId } = req.body;

  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    // Check if the user owns the comment
    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized to delete this comment' });
    }

    await comment.deleteOne();
    res.status(200).json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting comment' });
  }
});

export default router;
