import express from "express";
import { adminAuth } from "../middleware/auth.middleware";

import { allNotifications } from "../controllers/notify.controllers";
const notifyRoutes = express.Router();
notifyRoutes.get("/notify",allNotifications);
export default notifyRoutes;