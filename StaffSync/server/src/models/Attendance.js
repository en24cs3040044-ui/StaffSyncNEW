import mongoose from "mongoose";
const attendanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  dateKey: { type: String, required: true },
  checkIn: Date,
  checkOut: Date,
  status: { type: String, enum: ["Present", "Incomplete"], default: "Incomplete" }
}, { timestamps: true });
attendanceSchema.index({ employee: 1, dateKey: 1 }, { unique: true });
export default mongoose.model("Attendance", attendanceSchema);
