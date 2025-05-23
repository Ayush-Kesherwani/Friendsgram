import { Router } from "express";
import User from "../models/User.js";

const router = Router();

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