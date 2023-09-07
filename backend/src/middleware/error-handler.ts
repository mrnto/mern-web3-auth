import { NextFunction, Request, Response } from "express";
import HttpError, { StatusCodes } from "../errors/http-error";

const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    let status = StatusCodes.INTERNAL_SERVER_ERROR;
    let message = "Something went wrong...";

    if (err instanceof HttpError) {
        status = err.status;
        message = err.message;
    }

    res.status(status).json({ error: message });
};

export default errorHandler;
