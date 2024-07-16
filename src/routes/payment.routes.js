import express from "express";
import { userAuth, adminAuth } from "../middleware/auth.middleware";
import fileSaver from "../helper/multer";

import {
  userPayment,
  getAll,
  getPaymentByCode,
  getSingle,
  updatePayment,
  deletePayment
} from "../controllers/payment.controllers";

const paymentRoutes = express.Router();
paymentRoutes.post("/:categoryId",userAuth,fileSaver.single("phone"),userPayment);
paymentRoutes.get("/all",getAll);
paymentRoutes.get("/all/:code",getPaymentByCode);
paymentRoutes.get("/:paymentId",getSingle);
paymentRoutes.put("/:code",adminAuth,fileSaver.single("status"),updatePayment);
paymentRoutes.delete("/:id",adminAuth,deletePayment);
export default paymentRoutes;
