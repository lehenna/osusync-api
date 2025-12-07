import { Document, model, Schema } from "mongoose";

export interface Score {
    id: string;
    userId: number;
    osuId: number;
    osuContent: object;

    createdAt: Date;
    updatedAt: Date;
};

export type ScoreDocument = Document & Score;

const ScoreSchema = new Schema(
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
    },
    {
        timestamps: true
    }
);

export const ScoreModel = model<ScoreDocument>('Score', ScoreSchema);
