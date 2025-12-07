import { NextFunction, Request, Response } from 'express';
import { RecordService } from '../services/records';
import { validateDeviceToken } from '../utils/devices';
import { createErrorResponse, createSuccessResponse } from '../utils/response';
import { StatusCode } from '../enums/status-code';

export class RecordControllers {
    static async search(req: Request, res: Response, next: NextFunction) {
        try {
            const { authorization } = req.headers

            if (!authorization) {
                const result = createErrorResponse({
                    message: 'Authorization token required',
                    errors: ['Authorization header is required'],
                    statusCode: StatusCode.Unauthorized,
                })
                res.status(result.statusCode).json(result)
                return
            }

            const device = await validateDeviceToken(authorization)

            if (!device) {
                const result = createErrorResponse({
                    message: 'Invalid token',
                    errors: ['Invalid token'],
                    statusCode: StatusCode.Unauthorized,
                })
                res.status(result.statusCode).json(result)
                return
            }

            const recordService = RecordService.getInstance()

            const records = await recordService.search({ userId: device.userId, deviceId: device.id })

            const result = createSuccessResponse({
                message: 'Records',
                data: records,
            });
            res.status(result.statusCode).json(result)
        } catch (error) {
            next(error);
        }
    }

    static async complete(req: Request, res: Response, next: NextFunction) {
        try {
            const { authorization } = req.headers
            const { recordId } = req.params

            if (!authorization) {
                const result = createErrorResponse({
                    message: 'Authorization token required',
                    errors: ['Authorization header is required'],
                    statusCode: StatusCode.Unauthorized,
                })
                res.status(result.statusCode).json(result)
                return
            }

            const device = await validateDeviceToken(authorization)

            if (!device) {
                const result = createErrorResponse({
                    message: 'Invalid token',
                    errors: ['Invalid token'],
                    statusCode: StatusCode.Unauthorized,
                })
                res.status(result.statusCode).json(result)
                return
            }

            const recordService = RecordService.getInstance()

            await recordService.complete({ recordId, userId: device.userId })

            const result = createSuccessResponse({
                message: 'Record completed',
                data: null,
            });
            res.status(result.statusCode).json(result)
        } catch (error) {
            next(error);
        }
    }
}