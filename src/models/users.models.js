import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';
const userSchema = new mongoose.Schema(
  {
    _id: { type: String, default: uuidv4 },
    fullname: { type: String },
    username: { type: String },
    password: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "admin" },
    createdAt: { type: Date, default: Date.now }
  }
);

const userModel = mongoose.model("users", userSchema);
export default userModel;
