import express from "express";
import fileSaver from "../helper/multer";
import {
  addCategory,
  updateCategory,
  getAll,
  getAllFree,
  getAllPaid,
  singleCategory,
  deleteCategory,
} from "../controllers/category.controllers";
import { adminAuth, userAuth } from "../middleware/auth.middleware";
const categoryRoute = express.Router();
categoryRoute.post(
  "/record",
  adminAuth,
  fileSaver.single("title"),
  addCategory
);
categoryRoute.put(
  "/update/:id",
  adminAuth,
  fileSaver.single("title"),
  updateCategory
);
categoryRoute.get("/all", getAll);
categoryRoute.get("/all/free", userAuth, getAllFree);
categoryRoute.get("/all/paid", userAuth, getAllPaid);
categoryRoute.get("/single/:id", singleCategory);
categoryRoute.delete("/delete/:id", adminAuth, deleteCategory);

export default categoryRoute;
