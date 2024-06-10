import express from "express";
import fileSaver from "../helper/multer";
import {
  addExam,
  deleteExam,
  getAllFree,
  getAllPaid,
  singleExam,
  updateExam,
  getAll
} from "../controllers/exams.controllers";
import { adminAuth, userAuth } from "../middleware/auth.middleware";

const examRoute = express.Router();
examRoute.post("/record", adminAuth, fileSaver.single("title"), addExam);
examRoute.put("/update/:id", adminAuth, fileSaver.single("title"), updateExam);
examRoute.get("/all", getAll);
examRoute.get("/all/free",userAuth, getAllFree);
examRoute.get("/all/paid", userAuth, getAllPaid);
examRoute.get("/single/:id", singleExam);
examRoute.delete("/delete/:id", adminAuth, deleteExam);

export default examRoute;
