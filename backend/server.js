import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import connectDB from './config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import postRoutes from './routes/posts.js';
import commentRoutes from './routes/comments.js';
import messageRoutes from './routes/message.js';
<<<<<<< HEAD
import verifyRoutes from './routes/verify.js';
=======
import verifyRoute from './routes/verify.js';
>>>>>>> 32498628766418ba6b61ec991e3b17054b378932

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/verify', verifyRoute);
app.use('/posts', postRoutes)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/", (req, res) => {
  res.send("FriendsGram API is live");
});
app.use('/api/verify', verifyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static('uploads'));
app.use('/posts', commentRoutes);
app.use('/api/messages', messageRoutes);

// Connect DB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});