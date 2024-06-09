import express from "express";
import fileSaver from "../helper/multer";
import {
  deleteUser,
  getAll,
  login,
  signUp,
  singleUser,
  updateData,
} from "../controllers/users.controllers";

const userRoute = express.Router();
userRoute.post("/signup", fileSaver.single("username"), signUp);
userRoute.put("/update/:id", fileSaver.single("username"), updateData);
userRoute.get("/all", getAll);
userRoute.get("/single/:id", singleUser);
userRoute.delete("/delete/:id", deleteUser);
userRoute.post("/auth", fileSaver.single("username"), login)

export default userRoute;