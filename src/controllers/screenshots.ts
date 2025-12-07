import { NextFunction, Request, Response } from 'express';
import { base64, nonEmpty, object, pipe, string } from 'valibot';
import { createErrorResponse, createSuccessResponse } from '../utils/response';
import { StatusCode } from '../enums/status-code';
import { validateDeviceToken } from '../utils/devices';
import { SyncService } from '../services/syn';
import { RecordService } from '../services/records';
import { ModelName } from '../enums/models';
import { RecordAction } from '../enums/records';
import { validation } from '../utils/validation';
import { Websocket } from '../websocket';
import { WebsocketEvent } from '../enums/websocket';
import { ScreenshotsRepository } from '../repositories/screenshots';

export class ScreenshotControllers {
    static async create(req: Request, res: Response, next: NextFunction) {
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

            const { base64: base64Content } = validation(object({
                base64: pipe(string(), base64()),
            }), req.body)


            const syncService = SyncService.getInstance()

            const file = await syncService.createFile({ device, base64: base64Content })

            const currentRepository = ScreenshotsRepository.getInstance()

            const resource = await syncService.create(currentRepository, {
                device,
                storageId: file.id,
            })

            const recordService = RecordService.getInstance()

            const isNew = resource.updatedAt.getTime() === resource.createdAt.getTime()

            const action = isNew ? RecordAction.Create : RecordAction.Update

            const records = await recordService.create({
                action,
                modelId: resource.id,
                modelName: ModelName.Screenshot,
                userId: device.userId,
                omitDevices: [device.id],
            })

            const websocket = Websocket.getInstance()

            records.forEach((record) => {
                websocket.emit(`user::${device.userId}`, WebsocketEvent.Record, record)
            })

            const result = createSuccessResponse({
                message: 'Record create',
                statusCode: StatusCode.Created,
                data: null,
            });
            res.status(result.statusCode).json(result);
        } catch (error) {
            next(error)
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
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

            const { storageId } = validation(object({
                storageId: pipe(string(), nonEmpty()),
            }), req.body)

            const syncService = SyncService.getInstance()
            const currentRepository = ScreenshotsRepository.getInstance()

            const resource = await syncService.delete(currentRepository, {
                device,
                storageId,
            })

            if (!resource) {
                const result = createErrorResponse({
                    message: 'Invalid osu id',
                    errors: ['Invalid osu id'],
                    statusCode: StatusCode.NotFound,
                })
                res.status(result.statusCode).json(result)
                return
            }

            await syncService.deletFile({
                storageId,
                userId: device.userId,
            })

            const recordService = RecordService.getInstance()

            const records = await recordService.create({
                action: RecordAction.Delete,
                modelId: resource.id,
                modelName: ModelName.Screenshot,
                userId: device.userId,
                omitDevices: [device.id],
            })

            const websocket = Websocket.getInstance()

            records.forEach((record) => {
                websocket.emit(`user::${device.userId}`, WebsocketEvent.Record, record)
            })

            const result = createSuccessResponse({
                message: 'Record create',
                statusCode: StatusCode.Created,
                data: null,
            });
            res.status(result.statusCode).json(result);
        } catch (error) {
            next(error)
        }
    }
}