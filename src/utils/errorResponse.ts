import { Response } from "express";

export const sendErrorResponse = (res: Response, statusCode: number, message: string, errorCode?: string, details?: string) => {
    return res.status(statusCode).json({ message, errorCode, details });
};
