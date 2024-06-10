import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    examId: { type: mongoose.Schema.Types.ObjectId, ref: "exams" },
    question: { type: String, required: true },
    marks: { type: Number, default: 1},
    options: [{ type: mongoose.Schema.Types.ObjectId, ref: "options" }],
    addedAt: { type: Date, default: Date.now }
  }
);

const questionModel = mongoose.model("questions", questionSchema);
export default questionModel;

