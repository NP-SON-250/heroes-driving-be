import express from "express";
import fileSaver from "../helper/multer";
import { 
    addCategory,
    updateCategory,
    getAll,
    singleCategory,
    deleteCategory

 } from "../controllers/paidcategory.controllers";

const categoryRoute = express.Router();
categoryRoute.post("/record",fileSaver.single("title"), addCategory);
categoryRoute.put("/update/:id", fileSaver.single("title"), updateCategory);
categoryRoute.get("/all", getAll);
categoryRoute.get("/single/:id", singleCategory);
categoryRoute.delete("/delete/:id", deleteCategory);

export default categoryRoute;
