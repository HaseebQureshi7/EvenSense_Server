import express from "express";
import projectRouter from "./project.route";
import architectureRouter from "./architecture.route";
import teamMemberRouter from "./teamMember.route";
import linkRouter from "./link.route";

const router = express.Router();

router.use("/project", projectRouter);
router.use("/architecture", architectureRouter)
router.use("/teamMember", teamMemberRouter)
router.use("/link", linkRouter)

export default router;
