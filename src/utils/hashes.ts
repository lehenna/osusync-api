import crypto from "crypto";

export function getHashFromBase64(base64: string): string {
    const buffer = Buffer.from(base64, "base64");
    const hash = crypto.createHash("sha256").update(buffer).digest("hex");
    return hash;
}
