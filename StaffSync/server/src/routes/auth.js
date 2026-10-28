import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect, safeUser } from "../middleware/auth.js";
const router = Router();

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, department, jobTitle } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password are required" });
    if (password.length < 6) return res.status(400).json({ message: "Password must contain at least 6 characters" });
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: "An account with this email already exists" });
    // Public sign-up always creates an employee; privileged roles must be assigned by an administrator.
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 12), department, jobTitle, role: "employee" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ token, user: safeUser(user) });
  } catch (err) { next(err); }
});
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || "").toLowerCase() }).select("+password");
    if (!user || !(await bcrypt.compare(password || "", user.password))) return res.status(401).json({ message: "Invalid email or password" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: safeUser(user) });
  } catch (err) { next(err); }
});
router.get("/me", protect, (req, res) => res.json({ user: safeUser(req.user) }));
export default router;
