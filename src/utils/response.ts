import { StatusCode } from "../enums/status-code";

export interface ResponsePayload<T> {
    statusCode: StatusCode
    message: string
    data?: T
    errors?: string[]
}

export function createResponse<T>(payload: ResponsePayload<T>) {
    return {
        success: payload.statusCode < 400,
        statusCode: payload.statusCode,
        status: StatusCode[payload.statusCode],
        message: payload.message,
        errors: payload.errors,
    }
}

export interface SuccessResponsePayload<T> {
    message: string
    data?: T,
    statusCode?: StatusCode
}

export function createSuccessResponse<T>(payload: SuccessResponsePayload<T>) {
    return createResponse({
        message: payload.message,
        statusCode: payload.statusCode || StatusCode.OK,
        data: payload.data,
    })
}

export interface ErrorResponsePayload {
    message: string
    errors: string[]
    statusCode?: StatusCode
}

export function createErrorResponse(payload: ErrorResponsePayload) {
    return createResponse({
        message: payload.message,
        statusCode: payload.statusCode || StatusCode.InternalServerError,
        errors: payload.errors,
    })
}