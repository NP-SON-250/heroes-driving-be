import mongoose from "mongoose";
const optionSchema = new mongoose.Schema(
  {
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: "questions" },
    option: { type: String, required: true },
    points: { type: Number, required: true },
    addedAt: { type: Date, default: Date.now }
  }
);

const optionModel = mongoose.model("options", optionSchema);
export default optionModel;
