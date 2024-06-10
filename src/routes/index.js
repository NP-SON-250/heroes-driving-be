import express from "express";
import userRoute from "./users.routes";
import examRoute from "./exams.routes";
import docRouter from "../docs/doc";
import questionRoute from "./questions.routes";
import optionRoute from "./options.routes";
import newResponsesRoute from "./newconducts.routes";
import categoryRoute from "./categories.routes";


const router = express.Router();

// Route
router.use("/docs",docRouter)
router.use("/users", userRoute);
router.use("/exams", examRoute);
router.use("/categories", categoryRoute);
router.use("/questions",questionRoute);
router.use("/options",optionRoute);
router.use("/newresponses",newResponsesRoute);

export default router;
