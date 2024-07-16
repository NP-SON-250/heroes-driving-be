import mongoose from "mongoose";

const faqsSchema = new mongoose.Schema({
  question: { type: String, required: true },
  askedBy: { type: String, ref: "users" },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "replies" }],
  askedAt: { type: Date, default: Date.now },
});
const FaqsModel = mongoose.model("faqs",faqsSchema);
export default FaqsModel;