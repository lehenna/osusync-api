import { NextFunction, Request, Response } from 'express';
import { number, object } from 'valibot';
import { createErrorResponse, createSuccessResponse } from '../utils/response';
import { StatusCode } from '../enums/status-code';
import { validateDeviceToken } from '../utils/devices';
import { SyncService } from '../services/syn';
import { ScoresRepository } from '../repositories/scores';
import { RecordService } from '../services/records';
import { ModelName } from '../enums/models';
import { RecordAction } from '../enums/records';
import { validation } from '../utils/validation';
import { Websocket } from '../websocket';
import { WebsocketEvent } from '../enums/websocket';

export class ScoreControllers {
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

            const { osuContent, osuId } = validation(object({
                osuContent: object({}),
                osuId: number(),
            }), req.body)

            const syncService = SyncService.getInstance()

            const currentRepository = ScoresRepository.getInstance()

            const resource = await syncService.create(currentRepository, {
                device,
                osuContent,
                osuId,
            })

            const recordService = RecordService.getInstance()

            const isNew = resource.updatedAt.getTime() === resource.createdAt.getTime()

            const action = isNew ? RecordAction.Create : RecordAction.Update

            const records = await recordService.create({
                action,
                modelId: resource.id,
                modelName: ModelName.Score,
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

            const { osuId } = validation(object({
                osuId: number(),
            }), req.body)

            const syncService = SyncService.getInstance()
            const currentRepository = ScoresRepository.getInstance()

            const resource = await syncService.delete(currentRepository, {
                device,
                osuId,
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

            const recordService = RecordService.getInstance()

            const records = await recordService.create({
                action: RecordAction.Delete,
                modelId: resource.id,
                modelName: ModelName.Score,
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