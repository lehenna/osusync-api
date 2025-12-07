import { NextFunction, Request, Response } from 'express';
import { createSuccessResponse } from '../utils/response';
import { validateAccessToken } from '../utils/user-session';

export class UserControllers {
    static async profile(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await validateAccessToken(req.headers);
            const result = createSuccessResponse({
                message: 'User details',
                data: {
                    user,
                },
            });
            res.status(result.statusCode).json(result);
        } catch (error) {
            next(error);
        }
    }
}