import { Router } from 'express';
const router = Router();
import Post from '../models/Posts.js';
import upload from '../middleware/cloudinaryUpload.js';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post('/', upload.single('media'), async (req, res) => {
  try {
    const { caption, userId } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: 'Media file is required.' });

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "friendsgram_posts",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(file.buffer);
    });

    const mediaType = file.mimetype.startsWith('image') ? 'image' : 'video';

    const newPost = new Post({
      userId,
      caption,
      mediaPath: result.secure_url,
      mediaType,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Failed to create post:', error);
    res.status(500).json({ error: 'Failed to create post.' });
  }
});

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
  .sort({ createdAt: -1 })
  .populate('userId', 'name profilePic');
    res.json(posts);
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts.' });
  }
});

router.post('/:id/like', async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      const userId = req.body.userId;
  
      if (!post.likes.includes(userId)) {
        post.likes.push(userId);
      } else {
        post.likes = post.likes.filter(id => id !== userId);
      }
  
      await post.save();
      res.status(200).json({ likes: post.likes });
    } catch (err) {
      console.error('Error toggling like:', err);
      res.status(500).json({ error: 'Failed to like post' });
    }
  });

  router.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const posts = await Post.find({ userId }).sort({ createdAt: -1 });
      res.status(200).json(posts);
    } catch (error) {
      console.error('Error fetching user posts:', error);
      res.status(500).json({ message: 'Failed to fetch user posts' });
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: "Post not found" });
  
      await post.deleteOne();
      res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting post" });
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: "Post not found" });
  
      post.caption = req.body.caption;
      await post.save();
  
      res.status(200).json({ message: "Post updated", post });
    } catch (err) {
      res.status(500).json({ message: "Error updating post" });
    }
  });

export default router;