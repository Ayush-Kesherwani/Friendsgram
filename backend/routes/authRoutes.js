import express from "express";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

const ADMIN = {
    email: "ayush@friendsgram.com",
    password: "admin123",
  };
  
  router.post("/admin/login", (req, res) => {
    const { email, password } = req.body;
  
    if (email === ADMIN.email && password === ADMIN.password) {
      const token = jwt.sign({ isAdmin: true }, process.env.JWT_SECRET, { expiresIn: "1d" });
      return res.json({ token });
    } else {
      return res.status(401).json("Invalid admin credentials");
    }
  });

router.post('/register', register);
router.post('/login', login);

export default router;