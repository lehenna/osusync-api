import { Document, model, Schema } from "mongoose";

export interface Replay {
    id: string;
    userId: number;

    storageId: string;

    createdAt: Date;
    updatedAt: Date;
};

export type ReplayDocument = Document & Replay;

const ReplaySchema = new Schema(
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

export const ReplayModel = model<ReplayDocument>('Replay', ReplaySchema);
