import express from "express";
import userRoute from "./users.routes";
import examRoute from "./exams.routes";
import docRouter from "../docs/doc";
import questionRoute from "./questions.routes";
import optionRoute from "./options.routes";
import newResponsesRoute from "./newconducts.routes";
import categoryRoute from "./categories.routes";
import postRoutes from "./blogs.routes";
import MomopaymentRoute from "./Momopayments.routes";
import paymentRoutes from "./payment.routes";
const router = express.Router();

// Route
router.use("/docs",docRouter)
router.use("/users", userRoute);
router.use("/exams", examRoute);
router.use("/categories", categoryRoute);
router.use("/questions",questionRoute);
router.use("/options",optionRoute);
router.use("/newresponses",newResponsesRoute);
router.use("/posts",postRoutes);
router.use("/payments",paymentRoutes)
router.use("/momo",MomopaymentRoute)


export default router;
