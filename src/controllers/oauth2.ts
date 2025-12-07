import { NextFunction, Request, Response } from 'express';
import { nonEmpty, object, pipe, string, url } from 'valibot';
import { validation } from '../utils/validation';
import { OsuAPIService } from '../services/osu';
import { createSuccessResponse } from '../utils/response';
import { StatusCode } from '../enums/status-code';
import { APIError } from '../lib/error';

export class OAuth2Controllers {
    static async authorize(req: Request, res: Response, next: NextFunction) {
        try {
            const { callback } = validation(object({ callback: pipe(string(), url()) }), req.body);
            const osuAPI = OsuAPIService.getInstance();
            const osuAuthorizeURL = await osuAPI.authorize(callback);
            const result = createSuccessResponse({
                message: 'Authorization URL created',
                statusCode: StatusCode.Created,
                data: {
                    url: osuAuthorizeURL,
                    callback,
                },
            });
            res.status(result.statusCode).json(result);
        } catch (error) {
            next(error);
        }
    }

    static async callback(req: Request, res: Response, next: NextFunction) {
        try {
            const { code, callback } = validation(object({ code: pipe(string(), nonEmpty()), callback: pipe(string(), url()) }), req.body);
            const osuAPI = OsuAPIService.getInstance();
            const { accessToken } = await osuAPI.createToken(code, callback);
            if (!accessToken) throw new APIError('Invalid code or callback url', StatusCode.BadRequest, []);
            const result = createSuccessResponse({
                message: 'Token created',
                statusCode: StatusCode.Created,
                data: {
                    accessToken,
                },
            });
            res.status(result.statusCode).json(result);
        } catch (error) {
            next(error);
        }
    }
}