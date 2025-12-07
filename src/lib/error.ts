import { StatusCode } from "../enums/status-code";
import { createErrorResponse } from "../utils/response";

export class APIError extends Error {
    readonly statusCode: StatusCode;
    readonly errors: string[]

    constructor(message: string, statusCode: StatusCode, errors: string[]) {
        super(message)
        this.statusCode = statusCode;
        this.errors = errors;
    }

    toJSON() {
        return createErrorResponse({
            message: this.message,
            errors: this.errors,
            statusCode: this.statusCode,
        })
    }
}