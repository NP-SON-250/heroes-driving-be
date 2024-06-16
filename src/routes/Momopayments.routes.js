import express from "express";
import { requestToPay, getTransactionStatus } from "../controllers/Momopayments.controllers";
import { userAuth } from "../middleware/auth.middleware";

const MomopaymentRoute = express.Router();

// Ensure the route matches this definition
MomopaymentRoute.post("/payments/request/:id", userAuth, requestToPay);
MomopaymentRoute.get("/status", getTransactionStatus);

export default MomopaymentRoute;
