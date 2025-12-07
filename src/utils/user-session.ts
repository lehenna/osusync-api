import { IncomingHttpHeaders } from "http";
import { StatusCode } from "../enums/status-code";
import { APIError } from "../lib/error";
import { OsuAPIService } from "../services/osu";

export async function validateAccessToken(headers: IncomingHttpHeaders) {
    const { authorization } = headers;
    if (!authorization) throw new APIError('Authorization header is required', StatusCode.Unauthorized, []);
    const [_, accessToken] = authorization.split('Bearer ');
    if (!accessToken) throw new APIError('Authorization header must be bearer token', StatusCode.Unauthorized, []);
    const osuAPI = OsuAPIService.getInstance();
    const user = await osuAPI.getUser(accessToken);
    if (!user) throw new APIError('User not found', StatusCode.Unauthorized, []);
    return user;
}