import { Request, Response } from "express"
import { Architecture, IArchitecture } from "../../models/architecture.model"
import mongoose from "mongoose"

export const createArchitecture = async (req: Request, res: Response): Promise<Response | any> => {
    const { body }: { body: IArchitecture } = req
    if (!body || Object.keys(body).length === 0) {
        return res.status(400).json({ message: "No body provided" })
    }

    const { name, description, ofProject } = body
    if (!name || !description || !ofProject) {
        return res.status(400).json({ message: "Missing required fields" })
    }

    try {
        const alreadyExists = await Architecture.findOne({ ofProject })
        if (alreadyExists) {
            return res.status(400).json({ message: "Architecture already exists for this project" })
        }

        const newArchitecture = await Architecture.create(body)
        return res.status(201).json(newArchitecture)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }

}

export const deleteArchitecture = async (req: Request, res: Response): Promise<Response | any> => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid architecture ID" })
    }
    try {
        const architectureExists = await Architecture.findById(id)
        if (!architectureExists) {
            return res.status(404).json({ message: "Architecture not found" })
        }
        await Architecture.findByIdAndDelete(id)
        return res.status(200).json({ message: "Architecture deleted successfully" })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

export const getAllArchitectures = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const allArchitectures = await Architecture.find();
        if (allArchitectures && allArchitectures?.length > 0) {
            return res.status(200).json(allArchitectures)
        }
        else {
            return res.status(200).json({ message: "No Architectures found" })
        }
    } catch (err) {
        return res.status(400).json({ message: err.message })
    }
}

export const getProjectArchitecture = async (req: Request, res: Response): Promise<Response | any> => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid project ID" })
    }

    try {
        const projectExists = await Architecture.findOne({ ofProject: id })
        if (!projectExists) {
            return res.status(404).json({ message: "Architecture not found for this project" })
        }
        return res.status(200).json(projectExists)
    } catch (err) {
        return res.status(400).json({ message: err.message })
    }
}

export const updateArchitecture = async (req: Request, res: Response): Promise<Response | any> => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid architecture ID" })
    }

    try {
        const architectureExists = await Architecture.findById(id)
        if (!architectureExists) {
            return res.status(404).json({ message: "Architecture not found" })
        }

        const { body } = req
        const updatedArchitecture = await Architecture.findByIdAndUpdate(id, body,
            {
                new: true,
                strict: true,
                runValidators: true
            })
        if (!updatedArchitecture) {
            return res.status(400).json({ message: "Failed to update architecture" })
        }
        return res.status(200).json(updatedArchitecture)

    } catch (err) {
        return res.status(400).json({ message: err.message })
    }
}