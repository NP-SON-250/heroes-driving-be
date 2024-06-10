import mongoose from "mongoose";
const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  time: { type: Number, required: true },
  category: { type: String, enum: ["free", "paid"], default: "paid" },
  marks: { type: Number, default: 20 },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "questions" }],
  conductedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  addedAt: { type: Date, default: Date.now },
});

const examModel = mongoose.model("exams", examSchema);
export default examModel;
