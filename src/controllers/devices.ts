import { NextFunction, Request, Response } from 'express';
import { createSuccessResponse } from "../utils/response";
import { StatusCode } from '../enums/status-code';
import { DevicesRepository } from '../repositories/devices';
import { validateAccessToken } from '../utils/user-session';

export class DeviceControllers {
    static async search(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await validateAccessToken(req.headers);

            const devicesRepository = DevicesRepository.getInstance()
            const devices = await devicesRepository.find({
                userId: user.id,
            })
            const result = createSuccessResponse({
                message: 'Devices list',
                statusCode: StatusCode.OK,
                data: devices
            });
            res.status(result.statusCode).json(result);
        } catch (error) {
            next(error);
        }
    }
}