import { Router } from "express";
import { createTransport } from "nodemailer";
const router = Router();

let verificationCodes = {};

router.post("/send-code", async (req, res) => {
  const { email } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  verificationCodes[email] = code;

  try {
    const transporter = createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "FriendsGram Verification Code",
      text: `Your verification code is: ${code}`,
    });

    res.status(200).json({ message: "Code sent successfully!" });
  } catch (error) {
    console.error("Email sending failed:", error);
    res
      .status(500)
      .json({ message: "Failed to send code", error: error.message });
  }
});

router.post("/verify-code", (req, res) => {
  const { email, code } = req.body;

  if (verificationCodes[email] === code) {
    delete verificationCodes[email];
    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ success: false, message: "Invalid code" });
  }
});

export default router;
