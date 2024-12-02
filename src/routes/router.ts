import express from "express";
import projectRouter from "./project.route";
import architectureRouter from "./architecture.route";

const router = express.Router();

router.use("/project", projectRouter);
router.use("/architecture", architectureRouter)

export default router;
