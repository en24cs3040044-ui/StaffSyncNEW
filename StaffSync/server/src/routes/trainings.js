import { Router } from "express";
import Training from "../models/Training.js";
import { protect, allowRoles } from "../middleware/auth.js";
const router = Router();
router.use(protect);
router.get("/", async (_req, res, next) => {
  try { res.json(await Training.find().populate("createdBy", "name").populate("enrolledUsers", "name email").sort({ date: 1 })); }
  catch (err) { next(err); }
});
router.post("/", allowRoles("hr", "manager"), async (req, res, next) => {
  try {
    const { title, description, trainer, date, duration } = req.body;
    if (!title || !description || !date) return res.status(400).json({ message: "Title, description and date are required" });
    const item = await Training.create({ title, description, trainer, date, duration, createdBy: req.user._id });
    res.status(201).json(await item.populate("createdBy", "name"));
  } catch (err) { next(err); }
});
router.post("/:id/enroll", async (req, res, next) => {
  try {
    const item = await Training.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Training not found" });
    if (!item.enrolledUsers.some((id) => id.equals(req.user._id))) item.enrolledUsers.push(req.user._id);
    await item.save();
    res.json(await item.populate("enrolledUsers", "name email"));
  } catch (err) { next(err); }
});
export default router;
