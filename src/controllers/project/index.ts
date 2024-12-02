import { Request, Response } from "express";
import mongoose from "mongoose";
import { IProject, Project } from "../../models/project.model";

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

export const ViewProject = async (
  req: Request,
  res: Response
): Promise<Response | any> => {
  try {
    const projects = await Project.find();
    if (projects.length == 0) {
      // return res.status(204).send();
      return res.status(200).json({ message: "No projects found" });
    }
    return res.status(200).json(projects);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const GetProjectById = async (
  req: Request,
  res: Response
): Promise<Response | any> => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid project ID" });
  }

  try {
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    return res.status(200).json(project);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const EditProject = async (
  req: Request,
  res: Response
): Promise<Response | any> => {
  const { id } = req.params;
  const { body } = req;

  if (!body || Object.keys(body).length === 0) {
    return res.status(400).json({ message: "Request body cannot be empty" });
  }

  try {
    // Check if the provided ID is valid (MongoDB ObjectId check)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const projectExists = await Project.findById(id);

    if (!projectExists) {
      return res.status(404).json({ message: "Project not found" });
    }

    const updatedProject = await Project.findByIdAndUpdate(id, body, {
      new: true, // Return the updated project
      runValidators: true, // Ensure validation is applied to the update
    });

    return res.status(200).json({
      message: "Project updated successfully",
      updatedProject,
    });
  } catch (err) {
    return res.status(400).send({ message: err.message });
  }
};

export const DeleteProject = async (
  req: Request,
  res: Response
): Promise<Response | any> => {
  const { id } = req.params;

  try {
    const projectExists = await Project.findById(id);
    if (!projectExists) {
      return res.status(404).json({ message: "Project not found" });
    }
    await Project.findByIdAndDelete(id);
    return res.status(200).json({
      message: "Project deleted successfully",
      deletedProject: projectExists,
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
