import express from 'express';
import { CreateProject, DeleteProject, EditProject, GetProjectById, ViewProject } from '../controllers/project.controller';

const projectRouter = express.Router();

projectRouter.get("/", ViewProject)
projectRouter.get("/:id", GetProjectById)
projectRouter.post("/", CreateProject)
projectRouter.patch("/:id", EditProject)
projectRouter.delete("/:id", DeleteProject)

export default projectRouter