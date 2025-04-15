import Post from '../models/Post';

const createPost = async (req, res) => {
  const { caption, userId } = req.body;
  const file = req.file;

  if (!file) return res.status(400).json({ error: 'No media uploaded' });

  const mediaType = file.mimetype.startsWith('image') ? 'image' : 'video';

  const newPost = new Post({
    userId,
    caption,
    mediaPath: `/uploads/posts/${file.filename}`,
    mediaType,
  });

  await newPost.save();
  res.status(201).json(newPost);
};

export default { createPost };
