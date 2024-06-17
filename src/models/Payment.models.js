import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const paymentSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    paidBy: { type: String, ref: "users" },
    paidCategory: { type: String, ref: "categories" },
    paidAmount: {type: String},
    phone: {type: String},
    code:{type: String},
    expiredAt: {type: Date},
    expireStatus:{
        type: String,
        enum: ["active", "expired"],
        default: "active",
      },
    status: { type: String, enum: ["Ntiremeza", "Yemejwe"], default: "Ntiremeza" },
    paidOn: { type: Date, default: Date.now },
});

const PaymentModel = mongoose.model("payments",paymentSchema);
export default PaymentModel;