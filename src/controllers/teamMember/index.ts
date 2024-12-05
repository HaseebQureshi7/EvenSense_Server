import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ITeamMember, TeamMember } from "../../models/teamMember.model";
import mongoose from "mongoose";
import { Project } from "../../models/project.model";
import { sendErrorResponse } from "../../utils/errorResponse"; // Assuming you have this utility

export const createTeamMember = catchAsync(async (req: Request, res: Response): Promise<Response | any> => {
    const { body }: { body: ITeamMember } = req;

    if (!body || Object.entries(body).length === 0) {
        return sendErrorResponse(res, 400, "Request body cannot be empty");
    }

    const { name, ofProject, role } = body;
    if (!name || !ofProject || !role) {
        return sendErrorResponse(res, 400, "Missing required fields");
    }

    const newTM = await TeamMember.create(body);
    return res.status(201).json({
        message: "Team member created successfully",
        data: newTM
    });
});

export const deleteTeamMember = catchAsync(async (req: Request, res: Response): Promise<Response | any> => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return sendErrorResponse(res, 400, "Invalid TeamMember ID");
    }

    const existingTM = await TeamMember.findById(id);
    if (!existingTM) {
        return sendErrorResponse(res, 404, "TeamMember not found");
    }

    await TeamMember.findByIdAndDelete(existingTM?._id);
    return res.status(200).json({
        message: "TeamMember deleted successfully"
    });
});

export const getProjectTeamMembers = catchAsync(async (req: Request, res: Response): Promise<Response | any> => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return sendErrorResponse(res, 400, "Invalid Project ID");
    }

    const existingProject = await Project.findById(id);
    if (!existingProject) {
        return sendErrorResponse(res, 404, "Project not found");
    }

    const projectTMs = await TeamMember.find({ ofProject: id });
    return res.status(200).json(projectTMs);
});

export const getTeamMemberById = catchAsync(async (req: Request, res: Response): Promise<Response | any> => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return sendErrorResponse(res, 400, "Invalid TeamMember ID");
    }

    const existingTM = await TeamMember.findById(id);
    if (!existingTM) {
        return sendErrorResponse(res, 404, "TeamMember not found");
    }
    return res.status(200).json(existingTM);
});

export const updateTeamMember = catchAsync(async (req: Request, res: Response): Promise<Response | any> => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return sendErrorResponse(res, 400, "Invalid TeamMember ID");
    }

    const existingTM = await TeamMember.findById(id);
    if (!existingTM) {
        return sendErrorResponse(res, 404, "TeamMember not found");
    }

    const { body }: { body: ITeamMember } = req;
    const updatedTM = await TeamMember.findOneAndUpdate(existingTM?._id, body, {
        new: true,
        runValidators: true
    });

    return res.status(200).json({
        message: "TeamMember was updated",
        data: updatedTM
    });
});
