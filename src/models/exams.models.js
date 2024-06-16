import mongoose from "mongoose";
const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  time: { type: Number, required: true },
  marks: { type: Number, default: 20 },
  categoryId: { type: String, ref: "categories" },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "questions" }],
  conductedBy: [{ type: String, ref: "users" }],
  addedAt: { type: Date, default: Date.now },
});

const examModel = mongoose.model("exams", examSchema);
export default examModel;
