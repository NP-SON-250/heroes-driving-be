import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
  reply: { type: String, required: true },
  question: { type: mongoose.Schema.Types.ObjectId, ref: "faqs" },
  repliedBy: { type: String, ref: "users" },
  repliedAt: { type: Date, default: Date.now },
});
const ReplyModel = mongoose.model("replies",replySchema);
export default ReplyModel;