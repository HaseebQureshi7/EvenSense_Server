import { Request, Response } from "express";
import { IProject, Project } from "../models/project.model";

export const CreateProject = async (
  req: Request,
  res: Response
): Promise<Response | any> => {
  const { body }: { body: IProject } = req;

  if (!body || Object.keys(body).length == 0) {
    return res.status(400).json({ message: "Body is required" });
  }

  const { name, deadline, description } = body;

  if (!name || !deadline || !description) {
    return res.status(400).json({ message: "Missing fields in the body" });
  }

  try {
    const existingProject = await Project.findOne({ name });
    if (existingProject) {
      return res.status(400).json({ message: "Project name must be unique" });
    }

    const newProject = await Project.create({ name, deadline, description });
    return res.status(201).json(newProject);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const ViewProject = async (req: Request, res: Response): Promise<Response | any> => {
  try {
    const projects = await Project.find();
    if (projects.length == 0) {
      return res.status(200).json({ message: "No projects found" });
    }
    return res.status(200).json(projects);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const EditProject = async (req: Request, res: Response) => {};

export const DeleteProject = async (req: Request, res: Response) => {};
