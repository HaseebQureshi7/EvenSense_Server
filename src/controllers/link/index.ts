import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ILink, Link, linkTypes } from "../../models/link.model";
import { sendErrorResponse } from "../../utils/errorResponse";
import { isValidID } from "../../utils/isValidId";
import { Project } from "../../models/project.model";

export const createLink = catchAsync(async (req: Request, res: Response): Promise<Response | any> => {
    const { body }: { body: ILink } = req
    if (Object.entries(body).length == 0) {
        return sendErrorResponse(res, 400, "Request body cannot be empty")
    }

    const { name, ofProject, type, url } = body
    if (!name || !ofProject || !type || !url) {
        return sendErrorResponse(res, 400, "Missing required fields")
    }

    const newLink = await Link.create(body)
    return res.status(201).json(newLink)
})

export const deleteLink = catchAsync(async (req: Request, res: Response): Promise<Response | any> => {
    const { id } = req.params
    if (!isValidID(id)) {
        return sendErrorResponse(res, 400, "Invalid link ID")
    }

    const linkExists = await Link.findById(id)
    if (!linkExists) {
        return sendErrorResponse(res, 404, "Link not found")
    }

    await Link.findByIdAndDelete(linkExists?._id)
    return res.status(200).json({ message: "Link deleted successfully" })
})

export const getProjectLinks = catchAsync(async (req: Request, res: Response): Promise<Response | any> => {
    const { id } = req.params
    if (!isValidID(id)) {
        return sendErrorResponse(res, 400, "Invalid link ID")
    }

    const projectExists = await Project.findById(id)
    if (!projectExists) {
        return sendErrorResponse(res, 404, "Link Project not found")
    }

    const projectLinks = await Link.find({ ofProject: projectExists?._id })
    return res.status(200).json(projectLinks)
})

export const getLinksByType = catchAsync(async (req: Request, res: Response): Promise<Response | any> => {
    const { id } = req.params
    if (!isValidID(id)) {
        return sendErrorResponse(res, 400, "Invalid link ID")
    }

    const projectExists = await Project.findById(id)
    if (!projectExists) {
        return sendErrorResponse(res, 404, "Link Project not found")
    }

    const { type } = req.query as { type: linkTypes | undefined }
    if (!type) {
        return sendErrorResponse(res, 400, "Missing Query <type>")
    }

    const linkTypes: linkTypes[] = ["deploy", "dev", "doc"]
    if (!linkTypes.includes(type)) {
        return sendErrorResponse(res, 400, "Invalid Query <type> ")
    }

    const projectLinks = await Link.find({ ofProject: projectExists?._id, type })
    res.status(200).json(projectLinks)
})

export const updateLink = catchAsync(async (req: Request, res: Response): Promise<Response | any> => {
    const { id } = req.params
    if (!isValidID(id)) {
        return sendErrorResponse(res, 400, "Invalid link ID")
    }

    const linkExists = await Link.findById(id)
    if (!linkExists) {
        return sendErrorResponse(res, 404, "Link not found")
    }

    const { body }: { body: ILink } = req
    if (!body || Object.keys(body).length === 0) {
        return sendErrorResponse(res, 400, "Request body cannot be empty");
    }

    const updatedLink = await Link.findByIdAndUpdate(linkExists?._id, body, {
        new: true,
        runValidators: true
    })
    return res.status(200).json({ message: "Link updated successfully", data: updatedLink })
})