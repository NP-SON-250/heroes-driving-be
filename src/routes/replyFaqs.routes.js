import express from "express";
import { userAuth } from "../middleware/auth.middleware";
import fileSaver from "../helper/multer";
import {
  recordReply,
  allReplies,
  singleReply,
  updateReply,
  deleteReply,
} from "../controllers/reply.controllers";

const replyRoute = express.Router();
replyRoute.post("/:faqId", userAuth, fileSaver.single("reply"), recordReply);
replyRoute.get("/:faqId", allReplies);
replyRoute.get("/single/:id", singleReply);
replyRoute.put("/:id", userAuth, fileSaver.single("reply"), updateReply);
replyRoute.delete("/:id", userAuth, deleteReply);

export default replyRoute;
