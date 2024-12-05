import { Request, Response, NextFunction } from 'express';

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const currentDate = new Date().toLocaleString('en-US', {
        timeZone: 'UTC',
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    })
    
    const customError = {
        url: req.url,
        origin: req.headers['user-agent'],
        timeStamp: currentDate,
        status: err.status || 500,
        message: err.message || "Internal Server Error",
    };

    console.error("Error:", customError);

    res.status(err.status || 500).json({
        status: "error",
        message: err.message || "Internal Server Error",
    });
};

