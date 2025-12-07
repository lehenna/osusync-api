import axios from 'axios';
import qs from 'qs';

interface OsuAPIOptions {
    client: {
        id: string;
        secret: string;
    };
    apikey: string;
}

export class OsuAPIService {
    private static instance: OsuAPIService;

    static getInstance() {
        return this.instance;
    }

    private options: OsuAPIOptions;

    private constructor(options: OsuAPIOptions) {
        this.options = options;
    }

    static initialize(options: OsuAPIOptions) {
        const newInstance = new OsuAPIService(options);
        this.instance = newInstance;
    }

    async authorize(callback: string) {
        const url = new URL("https://osu.ppy.sh/oauth/authorize");
        url.searchParams.set('client_id', this.options.client.id);
        url.searchParams.set('redirect_uri', callback);
        url.searchParams.set('response_type', 'code');
        url.searchParams.set('scope', 'identify');
        return url.toString();
    }

    async createToken(code: string, callback: string): Promise<{ accessToken: string | null }> {
        try {
            const data = {
                client_id: this.options.client.id,
                client_secret: this.options.client.secret,
                code,
                grant_type: 'authorization_code',
                redirect_uri: callback,
            };

            const response = await axios.post("https://osu.ppy.sh/oauth/token", qs.stringify(data), {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });

            return {
                accessToken: response.data.access_token as string,
            };
        } catch {
            return {
                accessToken: null,
            };
        }
    }

    async getUser(accessToken: string): Promise<{ id: number; email: string; username: string } | null> {
        try {
            const response = await axios.get(`https://osu.ppy.sh/api/v2/me`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            return response.data;
        } catch {
            return null;
        }
    }
}