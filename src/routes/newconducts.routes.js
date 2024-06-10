import express from "express";
import { addResponses, getUserResponses } from "../controllers/newconducts.controllers";
import { userAuth } from "../middleware/auth.middleware";
const newResponsesRoute = express.Router();
newResponsesRoute.post(
  "/add/:examId",
  userAuth,
  addResponses
);
newResponsesRoute.get(
  "/user",
  userAuth,
  getUserResponses
);
export default newResponsesRoute;
