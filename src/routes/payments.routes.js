import express from "express";
import {
  requestToPay,
  getTransactionStatus,
} from "../controllers/payments.controllers";
import { userAuth } from "../middleware/auth.middleware";

const paymentRoute = express.Router();

// Ensure the route matches this definition
paymentRoute.post('/payments/request/:id', userAuth, requestToPay);
paymentRoute.get("/status", getTransactionStatus);

export default paymentRoute;
