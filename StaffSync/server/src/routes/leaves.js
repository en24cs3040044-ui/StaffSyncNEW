import { Router } from "express";
import Leave from "../models/Leave.js";
import { protect, allowRoles } from "../middleware/auth.js";
const router = Router();
router.use(protect);
router.post("/", async (req, res, next) => {
  try {
    const { type, startDate, endDate, reason } = req.body;
    if (!startDate || !endDate || !reason) return res.status(400).json({ message: "Start date, end date and reason are required" });
    if (new Date(endDate) < new Date(startDate)) return res.status(400).json({ message: "End date must be on or after start date" });
    const leave = await Leave.create({ employee: req.user._id, type, startDate, endDate, reason });
    res.status(201).json(await leave.populate("employee", "name email department"));
  } catch (err) { next(err); }
});
router.get("/", async (req, res, next) => {
  try {
    const filter = ["hr", "manager"].includes(req.user.role) ? {} : { employee: req.user._id };
    const leaves = await Leave.find(filter).populate("employee", "name email department").populate("reviewedBy", "name").sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) { next(err); }
});
router.patch("/:id", allowRoles("hr", "manager"), async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["Approved", "Rejected"].includes(status)) return res.status(400).json({ message: "Status must be Approved or Rejected" });
    const leave = await Leave.findByIdAndUpdate(req.params.id, { status, reviewedBy: req.user._id, reviewedAt: new Date() }, { new: true, runValidators: true }).populate("employee", "name email department").populate("reviewedBy", "name");
    if (!leave) return res.status(404).json({ message: "Leave request not found" });
    res.json(leave);
  } catch (err) { next(err); }
});
export default router;
