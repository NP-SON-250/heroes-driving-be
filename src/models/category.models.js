import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const { Schema, model } = mongoose;

const CategorySchema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    examsNumber: { type: Number, required: true },
    amount: { type: String, required: true },
    duration: { type: Number, required: true },
    type:{ type: String, enum: ["free", "paid"], default: "paid" },
    exams: [{ type: mongoose.Schema.Types.ObjectId, ref: "exams" }],
    addedAt: { type: Date, default: Date.now }
  },
);

const CategoryModel = model("categories", CategorySchema);

export default CategoryModel;
