import express from "express";
import {
  getArchitectureById,
  createArchitecture,
  deleteArchitecture,
  updateArchitecture,
} from "../controllers/architecture";

const architectureRouter = express.Router();

architectureRouter.get("/:id", getArchitectureById);
architectureRouter.post("/", createArchitecture);
architectureRouter.patch("/:id", updateArchitecture);
architectureRouter.delete("/:id", deleteArchitecture);

export default architectureRouter;
