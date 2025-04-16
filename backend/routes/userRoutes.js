import { Router } from "express";
import multer, { diskStorage } from "multer";
import { extname } from "path";
import { getUserById, updateProfilePic, followUser, unfollowUser, updateProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = Router();

router.get("/", (req, res) => {
  res.send("Users route works");
});

router.get("/ping", (req, res) => {
  console.log("✅ /ping route hit");
  res.json({ message: "Ping success" });
});

// Multer config
const storage = diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profilePics/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + extname(file.originalname));
  },
});
const upload = multer({ storage });

router.post('/upload-profile-pic/:id', upload.single('profilePic'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { profilePic: `/uploads/profilePics/${req.file.filename}` },
      { new: true }
    );
    res.status(200).json({ message: "Profile picture updated", 
      user,
      imageUrl: `${process.env.BASE_URL}/uploads/profilePics/${req.file.filename}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to upload profile picture" });
  }
});

router.get("/search", async (req, res) => {
  const query = req.query.q;

  try {
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    });

    res.json(users);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Search failed" });
  }
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

router.put("/edit/:id", protect, updateProfile);
router.put('/follow/:id', protect, followUser);
router.put('/unfollow/:id', protect, unfollowUser);

router.get("/:id", getUserById);

export default router;