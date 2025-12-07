import { DeleteObjectCommand, DeleteObjectsCommand, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

interface StorageOptions {
    accessKey: string;
    secretKey: string;
    url: string;
    bucket: string;
    region: string;
}

export class StorageService {
    private static instance: StorageService;

    static getInstance() {
        return this.instance;
    }

    private s3: S3Client;
    private bucket: string;

    private constructor(options: StorageOptions) {
        this.bucket = options.bucket;

        this.s3 = new S3Client({
            region: options.region ?? "auto",
            endpoint: options.url,
            credentials: {
                accessKeyId: options.accessKey,
                secretAccessKey: options.secretKey,
            },
        });
    }

    static initialize(options: StorageOptions) {
        const newInstance = new StorageService(options);
        this.instance = newInstance;
    }

    private async fileExists(hash: string): Promise<boolean> {
        try {
            await this.s3.send(
                new HeadObjectCommand({
                    Bucket: this.bucket,
                    Key: hash,
                })
            );
            return true;
        } catch (err: any) {
            if (err.name === "NotFound" || err.$metadata?.httpStatusCode === 404) {
                return false;
            }
            throw err;
        }
    }

    async saveFile(hash: string, base64: string): Promise<void> {
        const exists = await this.fileExists(hash);
        if (exists) return;

        const buffer = Buffer.from(base64, "base64");

        await this.s3.send(
            new PutObjectCommand({
                Bucket: this.bucket,
                Key: hash,
                Body: buffer,
                ContentType: "application/zip",
            })
        );
    }

    async removeFile(hash: string): Promise<void> {
        await this.s3.send(
            new DeleteObjectCommand({
                Bucket: this.bucket,
                Key: hash,
            })
        );
    }

    async removeFiles(hashes: string[]): Promise<void> {
        if (hashes.length === 0) return;

        const objects = hashes.map((hash) => ({ Key: hash }));

        await this.s3.send(
            new DeleteObjectsCommand({
                Bucket: this.bucket,
                Delete: {
                    Objects: objects,
                    Quiet: true,
                },
            })
        );
    }
}