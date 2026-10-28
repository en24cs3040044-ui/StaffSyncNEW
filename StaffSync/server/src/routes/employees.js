import { Router } from "express";
import User from "../models/User.js";
import { protect, allowRoles, safeUser } from "../middleware/auth.js";
const router = Router();
router.use(protect);
router.get("/", allowRoles("hr", "manager"), async (req, res, next) => {
  try {
    const users = await User.find().sort({ name: 1 });
    res.json(users.map(safeUser));
  } catch (err) { next(err); }
});
router.get("/me", (req, res) => res.json({ user: safeUser(req.user) }));
router.put("/me", async (req, res, next) => {
  try {
    const allowed = ["name", "department", "jobTitle", "phone"];
    allowed.forEach((key) => { if (req.body[key] !== undefined) req.user[key] = req.body[key]; });
    await req.user.save();
    res.json({ user: safeUser(req.user) });
  } catch (err) { next(err); }
});
router.put("/:id", allowRoles("hr"), async (req, res, next) => {
  try {
    const allowed = ["name", "department", "jobTitle", "phone", "role"];
    const updates = {};
    allowed.forEach((key) => { if (req.body[key] !== undefined) updates[key] = req.body[key]; });
    if (updates.role && !["employee", "manager", "hr"].includes(updates.role)) return res.status(400).json({ message: "Invalid role" });
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ message: "Employee not found" });
    res.json(safeUser(user));
  } catch (err) { next(err); }
});
export default router;
