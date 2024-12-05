import { Request, Response } from "express";
import mongoose from "mongoose";
import { IProject, Project } from "../../models/project.model";
import { sendErrorResponse } from "../../utils/errorResponse";
import { catchAsync } from "../../utils/catchAsync"; // Import catchAsync

export const CreateProject = catchAsync(async (
  req: Request,
  res: Response
): Promise<Response | any> => {
  const { body }: { body: IProject } = req;

  if (!body || Object.keys(body).length === 0) {
    return sendErrorResponse(res, 400, "Body is required");
  }

  const { name, deadline, description } = body;

  if (!name || !deadline || !description) {
    return sendErrorResponse(res, 400, "Missing fields in the body");
  }

  const existingProject = await Project.findOne({ name });
  if (existingProject) {
    return sendErrorResponse(res, 400, "Project name must be unique");
  }

  const newProject = await Project.create({ name, deadline, description });
  return res.status(201).json(newProject);
});

export const ViewProject = catchAsync(async (
  req: Request,
  res: Response
): Promise<Response | any> => {
  const projects = await Project.find();
  if (projects.length === 0) {
    return sendErrorResponse(res, 200, "No projects found");
  }
  return res.status(200).json(projects);
});

export const GetProjectById = catchAsync(async (
  req: Request,
  res: Response
): Promise<Response | any> => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return sendErrorResponse(res, 400, "Invalid project ID");
  }

  const project = await Project.findById(id);
  if (!project) {
    return sendErrorResponse(res, 404, "Project not found");
  }
  return res.status(200).json(project);
});

export const EditProject = catchAsync(async (
  req: Request,
  res: Response
): Promise<Response | any> => {
  const { id } = req.params;
  const { body } = req;

  if (!body || Object.keys(body).length === 0) {
    return sendErrorResponse(res, 400, "Request body cannot be empty");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return sendErrorResponse(res, 400, "Invalid project ID");
  }

  const projectExists = await Project.findById(id);
  if (!projectExists) {
    return sendErrorResponse(res, 404, "Project not found");
  }

  const updatedProject = await Project.findByIdAndUpdate(id, body, {
    new: true, // Return the updated project
    runValidators: true, // Ensure validation is applied to the update
  });

  return res.status(200).json({
    message: "Project updated successfully",
    updatedProject,
  });
});

export const DeleteProject = catchAsync(async (
  req: Request,
  res: Response
): Promise<Response | any> => {
  const { id } = req.params;

  const projectExists = await Project.findById(id);
  if (!projectExists) {
    return sendErrorResponse(res, 404, "Project not found");
  }

  await Project.findByIdAndDelete(id);
  return res.status(200).json({
    message: "Project deleted successfully",
    deletedProject: projectExists,
  });
});
