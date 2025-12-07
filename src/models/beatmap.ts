import { Document, model, Schema } from "mongoose";

export interface Beatmap {
    id: string;
    userId: number;

    osuId: number;
    osuContent: object;
    storageId: string;

    createdAt: Date;
    updatedAt: Date;
};

export type BeatmapDocument = Document & Beatmap;

const BeatmapSchema = new Schema(
    {
        userId: {
            type: Number,
            required: true,
        },
        osuId: {
            type: Number,
            required: true,
        },
        osuContent: {
            type: Object,
            required: true,
        },
        storageId: {
            type: String,
        },
    },
    {
        timestamps: true
    }
);

export const BeatmapModel = model<BeatmapDocument>('Beatmap', BeatmapSchema);
