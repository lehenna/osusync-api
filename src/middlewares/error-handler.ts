import { NextFunction, Request, Response } from "express";
import { APIError } from "../lib/error";
import { createErrorResponse } from "../utils/response";

export async function errorHandler(error: any, __: Request, res: Response, _: NextFunction) {
    if (error instanceof APIError) {
        const response = error.toJSON()
        res.status(response.statusCode).json(response)
        return
    }
    const response = createErrorResponse({
        message: "Internal server error",
        errors: [],
    })
    res.status(response.statusCode).json(response);
}