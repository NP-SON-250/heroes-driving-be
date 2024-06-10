import express from "express";
import { addOption, deleteOption, getAll, getQuestuionsOption, singleOption, updateOption } from "../controllers/option.controllers";
import fileSaver from "../helper/multer";
import { adminAuth } from "../middleware/auth.middleware";

const optionRoute = express.Router();
optionRoute.post("/record/:id",adminAuth,fileSaver.single("option"),addOption);
optionRoute.put("/update/:id",adminAuth,fileSaver.single("question"),updateOption);
optionRoute.get("/all",getAll);
optionRoute.get("/all/:id",getQuestuionsOption);
optionRoute.get("/single/:id",singleOption);
optionRoute.delete("/delete/:id",adminAuth,deleteOption);

export default optionRoute;