import { NextFunction, Request, Response } from 'express';
import { base64, number, object, optional, pipe, string } from 'valibot';
import { createErrorResponse, createSuccessResponse } from '../utils/response';
import { StatusCode } from '../enums/status-code';
import { validateDeviceToken } from '../utils/devices';
import { SyncService } from '../services/syn';
import { BeatmapsRepository } from '../repositories/beatmaps';
import { RecordService } from '../services/records';
import { ModelName } from '../enums/models';
import { RecordAction } from '../enums/records';
import { validation } from '../utils/validation';
import { Websocket } from '../websocket';
import { WebsocketEvent } from '../enums/websocket';

export class BeatmapControllers {
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

            const { osuContent, osuId, base64: base64Content } = validation(object({
                osuContent: object({}),
                osuId: number(),
                base64: optional(pipe(string(), base64())),
            }), req.body)

            let storageId

            const syncService = SyncService.getInstance()

            if (base64Content) {
                const file = await syncService.createFile({ device, base64: base64Content })
                storageId = file.id
            }

            const currentRepository = BeatmapsRepository.getInstance()

            const resource = await syncService.create(currentRepository, {
                device,
                osuContent,
                osuId,
                storageId,
            })

            const recordService = RecordService.getInstance()

            const isNew = resource.updatedAt.getTime() === resource.createdAt.getTime()

            const action = isNew ? RecordAction.Create : RecordAction.Update

            const records = await recordService.create({
                action,
                modelId: resource.id,
                modelName: ModelName.Beatmap,
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
            const currentRepository = BeatmapsRepository.getInstance()

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
                modelName: ModelName.Beatmap,
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