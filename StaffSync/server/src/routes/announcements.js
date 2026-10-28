import { Router } from "express";
import Announcement from "../models/Announcement.js";
import { protect, allowRoles } from "../middleware/auth.js";
const router = Router();
router.use(protect);
router.get("/", async (_req, res, next) => {
  try { res.json(await Announcement.find().populate("author", "name role").sort({ createdAt: -1 })); }
  catch (err) { next(err); }
});
router.post("/", allowRoles("hr"), async (req, res, next) => {
  try {
    const { title, body, category } = req.body;
    if (!title || !body) return res.status(400).json({ message: "Title and message are required" });
    const item = await Announcement.create({ title, body, category, author: req.user._id });
    res.status(201).json(await item.populate("author", "name role"));
  } catch (err) { next(err); }
});
router.delete("/:id", allowRoles("hr"), async (req, res, next) => {
  try {
    const item = await Announcement.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Announcement not found" });
    res.json({ message: "Announcement deleted" });
  } catch (err) { next(err); }
});
export default router;
