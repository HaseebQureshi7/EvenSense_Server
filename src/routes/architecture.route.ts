import express from "express";
import {
  createArchitecture,
  deleteArchitecture,
  updateArchitecture,
  getProjectArchitecture,
  getAllArchitectures,
} from "../controllers/architecture";

const architectureRouter = express.Router();

architectureRouter.get("/", getAllArchitectures);
architectureRouter.get("/get_project_architecture/:id", getProjectArchitecture);
architectureRouter.post("/", createArchitecture);
architectureRouter.patch("/:id", updateArchitecture);
architectureRouter.delete("/:id", deleteArchitecture);

export default architectureRouter;
