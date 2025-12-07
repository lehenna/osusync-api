import { Document, model, Schema } from "mongoose";

export interface Skin {
    id: string;
    userId: number;

    storageId: string;

    createdAt: Date;
    updatedAt: Date;
};

export type SkinDocument = Document & Skin;

const SkinSchema = new Schema(
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

export const SkinModel = model<SkinDocument>('Skin', SkinSchema);
