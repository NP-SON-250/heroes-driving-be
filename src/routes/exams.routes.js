import express from "express";
import fileSaver from "../helper/multer";
import {
  addExam,
  deleteExam,
  singleExam,
  updateExam,
  getAll,
  getCategoryExams
} from "../controllers/exams.controllers";
import { adminAuth } from "../middleware/auth.middleware";

const examRoute = express.Router();
examRoute.post("/record/:catId", adminAuth, fileSaver.single("title"), addExam);
examRoute.put("/update/:id", adminAuth, fileSaver.single("title"), updateExam);
examRoute.get("/all", getAll);
examRoute.get("/all/:id", getCategoryExams);
examRoute.get("/single/:id", singleExam);
examRoute.delete("/delete/:id", adminAuth, deleteExam);

export default examRoute;
