import express from 'express';
import { CreateProject, DeleteProject, EditProject, ViewProject } from '../controllers/project.controller';

const projectRouter = express.Router();

projectRouter.get("/", ViewProject)
projectRouter.post("/", CreateProject)
projectRouter.put("/:id", EditProject)
projectRouter.delete("/:id", DeleteProject)

export default projectRouter