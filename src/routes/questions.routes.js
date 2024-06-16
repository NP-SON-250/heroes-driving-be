import express from "express";
import { adminAuth } from "../middleware/auth.middleware";
import {
  addQuestion,
  deleteQuestion,
  getExamsQuestuions,
  singleQuestion,
  updateQuestion,
  allQuestions,
} from "../controllers/questions.controllers";
import fileSaver from "../helper/multer";

const questionRoute = express.Router();
questionRoute.post(
  "/record/:id",
  adminAuth,
  fileSaver.single("question"),
  addQuestion
);
questionRoute.put(
  "/update/:id",
  adminAuth,
  fileSaver.single("question"),
  updateQuestion
);
questionRoute.get("/all", allQuestions);
questionRoute.get("/all/:id", getExamsQuestuions);
questionRoute.get("/single/:id", singleQuestion);
questionRoute.delete("/delete/:id", adminAuth, deleteQuestion);

export default questionRoute;
