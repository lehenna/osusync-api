export function getBase64Size(base64: string): number {
    const buffer = Buffer.from(base64, "base64")
    return buffer.length
}