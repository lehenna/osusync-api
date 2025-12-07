import path from 'path';
import dotenv from 'dotenv';

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

dotenv.config({
    path: path.join(process.cwd(), `.env.${mode}`),
});

export const config = {
    mode,
    port: parseInt(process.env.PORT || '5001', 10),
    redis: {
        url: process.env.REDIS_URL!,
        database: parseInt(process.env.REDIS_DATABASE || '0'),
    },
    osu: {
        client: {
            id: process.env.OSU_CLIENT_ID!,
            secret: process.env.OSU_CLIENT_SECRET!,
        },
        apikey: process.env.OSU_APIKEY!,
    },
    r2: {
        accessKey: process.env.R2_ACCESS_KEY!,
        secretKey: process.env.R2_SECRET_KEY!,
        url: process.env.R2_API_URL!,
        bucket: process.env.R2_BUCKET!,
        region: process.env.R2_REGION!,
    },
    paypal: {
        client: {
            id: process.env.PAYPAL_CLIENT_ID!,
            secret: process.env.PAYPAL_CLIENT_SECRET,
        },
    },
};