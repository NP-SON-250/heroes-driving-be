import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const { Schema, model } = mongoose;

const paymentSchema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    catId: { type: String, ref: "PaidCategories", required: true },
    userId: { type: String, ref: "users", required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    phone: { type: String, required: true },
    paymentStatus: { type: String, required: true },
    existanceStatus: {
      type: String,
      enum: ["active", "expired"],
      default: "active",
    },
    createdAt: { type: Date, default: Date.now },
  },
  {}
);

const PaymentModel = model("payments", paymentSchema);

export default PaymentModel;
