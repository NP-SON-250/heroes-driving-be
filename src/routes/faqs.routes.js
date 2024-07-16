import express from "express";
import { userAuth } from "../middleware/auth.middleware";
import fileSaver from "../helper/multer";
import {
  recordFaqs,
  allFaqs,
  singleFaqs,
  updateFaqs,
  deleteFaq,
} from "../controllers/faqs.controllers";

const faqsRoute = express.Router();
faqsRoute.post("/", userAuth, fileSaver.single("question"), recordFaqs);
faqsRoute.get("/",allFaqs);
faqsRoute.get("/:id", singleFaqs);
faqsRoute.put("/:id",userAuth, fileSaver.single("question"),updateFaqs);
faqsRoute.delete("/:id",userAuth,deleteFaq);

export default faqsRoute;