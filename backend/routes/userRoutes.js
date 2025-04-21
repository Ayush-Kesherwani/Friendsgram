import { Router } from "express";
import { getUserById, updateProfilePic, followUser, unfollowUser, updateProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/cloudinaryUpload.js";
import User from "../models/User.js";

const router = Router();

router.get("/", (req, res) => {
  res.send("Users route works");
});

router.get("/ping", (req, res) => {
  console.log("✅ /ping route hit");
  res.json({ message: "Ping success" });
});

router.put('/upload-profile-pic/:id', upload.single('profilePic'), async (req, res) => {
  try {
    const userId = req.params.id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture: req.file.path },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to upload profile picture' });
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