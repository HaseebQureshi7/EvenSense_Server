import { Request, Response } from "express";
import { Architecture, IArchitecture } from "../../models/architecture.model";
import mongoose from "mongoose";
import { sendErrorResponse } from "../../utils/errorResponse";
import { catchAsync } from "../../utils/catchAsync";  // Import catchAsync

export const createArchitecture = catchAsync(async (req: Request, res: Response): Promise<Response | any> => {
    const { body }: { body: IArchitecture } = req;
    if (!body || Object.keys(body).length === 0) {
        return sendErrorResponse(res, 400, "No body provided");
    }

    const { name, description, ofProject } = body;
    if (!name || !description || !ofProject) {
        return sendErrorResponse(res, 400, "Missing required fields");
    }

    const alreadyExists = await Architecture.findOne({ ofProject });
    if (alreadyExists) {
        return sendErrorResponse(res, 400, "Architecture already exists for this project");
    }

    const newArchitecture = await Architecture.create(body);
    return res.status(201).json(newArchitecture);
});

export const deleteArchitecture = catchAsync(async (req: Request, res: Response): Promise<Response | any> => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return sendErrorResponse(res, 400, "Invalid architecture ID");
    }

    const architectureExists = await Architecture.findById(id);
    if (!architectureExists) {
        return sendErrorResponse(res, 404, "Architecture not found");
    }
    await Architecture.findByIdAndDelete(id);
    return res.status(200).json({ message: "Architecture deleted successfully" });
});

export const getAllArchitectures = catchAsync(async (req: Request, res: Response): Promise<Response | any> => {
    const allArchitectures = await Architecture.find();
    if (allArchitectures && allArchitectures?.length > 0) {
        return res.status(200).json(allArchitectures);
    } else {
        return sendErrorResponse(res, 200, "No Architectures found");
    }
});

export const getProjectArchitecture = catchAsync(async (req: Request, res: Response): Promise<Response | any> => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return sendErrorResponse(res, 400, "Invalid project ID");
    }

    const projectExists = await Architecture.findOne({ ofProject: id });
    if (!projectExists) {
        return sendErrorResponse(res, 404, "Architecture not found for this project");
    }
    return res.status(200).json(projectExists);
});

export const updateArchitecture = catchAsync(async (req: Request, res: Response): Promise<Response | any> => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return sendErrorResponse(res, 400, "Invalid architecture ID");
    }

    const architectureExists = await Architecture.findById(id);
    if (!architectureExists) {
        return sendErrorResponse(res, 404, "Architecture not found");
    }

    const { body } = req;
    const updatedArchitecture = await Architecture.findByIdAndUpdate(id, body, {
        new: true,
        strict: true,
        runValidators: true,
    });
    if (!updatedArchitecture) {
        return sendErrorResponse(res, 400, "Failed to update architecture");
    }
    return res.status(200).json(updatedArchitecture);
});
