import { Router } from "express";
import { verifyAdmin } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = Router();

const ADMIN = {
  email: "ayush@friendsgram.com",
  password: "admin123",
};

router.post("/adminlogin", (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN.email && password === ADMIN.password) {
    const token = jwt.sign({ isAdmin: true }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res.json({ token });
  } else {
    return res.status(401).json("Invalid admin credentials");
  }
});

router.get("/admin/users", verifyAdmin, async (req, res) => {
    const users = await User.find().select("-password");
    res.json(users);
});
  
// Delete a user
router.delete("/admin/users/:id", verifyAdmin, async (req, res) => {
await User.findByIdAndDelete(req.params.id);
res.json({ message: "User deleted" });
});

export default router;