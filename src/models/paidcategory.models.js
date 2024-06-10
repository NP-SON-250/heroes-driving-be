import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const { Schema, model } = mongoose;

const paidCategorySchema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    exams: { type: Number, required: true },
    amount: { type: String, required: true },
    duration: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {}
);

const PaidCategoryModel = model("PaidCategories", paidCategorySchema);

export default PaidCategoryModel;
