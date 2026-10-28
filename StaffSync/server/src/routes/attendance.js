import { Router } from "express";
import Attendance from "../models/Attendance.js";
import { protect, allowRoles } from "../middleware/auth.js";
const router = Router();
router.use(protect);
const todayKey = () => new Date().toLocaleDateString("en-CA");
router.post("/check-in", async (req, res, next) => {
  try {
    const dateKey = todayKey();
    let record = await Attendance.findOne({ employee: req.user._id, dateKey });
    if (record?.checkIn) return res.status(409).json({ message: "You have already checked in today" });
    if (!record) record = new Attendance({ employee: req.user._id, dateKey });
    record.checkIn = new Date();
    record.status = "Incomplete";
    await record.save();
    res.status(201).json(record);
  } catch (err) { next(err); }
});
router.post("/check-out", async (req, res, next) => {
  try {
    const record = await Attendance.findOne({ employee: req.user._id, dateKey: todayKey() });
    if (!record?.checkIn) return res.status(400).json({ message: "Please check in first" });
    if (record.checkOut) return res.status(409).json({ message: "You have already checked out today" });
    record.checkOut = new Date(); record.status = "Present"; await record.save();
    res.json(record);
  } catch (err) { next(err); }
});
router.get("/", async (req, res, next) => {
  try {
    const filter = ["hr", "manager"].includes(req.user.role) ? {} : { employee: req.user._id };
    const records = await Attendance.find(filter).populate("employee", "name email department").sort({ dateKey: -1 }).limit(200);
    res.json(records);
  } catch (err) { next(err); }
});
export default router;
