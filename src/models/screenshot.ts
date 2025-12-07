import { Document, model, Schema } from "mongoose";

export interface Screenshot {
    id: string;
    userId: number;

    storageId: string;

    createdAt: Date;
    updatedAt: Date;
};

export type ScreenshotDocument = Document & Screenshot;

const ScreenshotSchema = new Schema(
    {
        userId: {
            type: Number,
            required: true,
        },
        storageId: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true
    }
);

export const ScreenshotModel = model<ScreenshotDocument>('Screenshot', ScreenshotSchema);
