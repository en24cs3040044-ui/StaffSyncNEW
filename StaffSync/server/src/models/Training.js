import mongoose from "mongoose";
const trainingSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  trainer: { type: String, default: "To be announced" },
  date: { type: Date, required: true },
  duration: { type: String, default: "1 day" },
  enrolledUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });
export default mongoose.model("Training", trainingSchema);
