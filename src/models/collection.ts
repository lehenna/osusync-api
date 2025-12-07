import { Document, model, Schema } from "mongoose";

export interface Collection {
    id: string;
    userId: number;
    osuId: number;
    osuContent: object;

    createdAt: Date;
    updatedAt: Date;
};

export type CollectionDocument = Document & Collection;

const CollectionSchema = new Schema(
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

export const CollectionModel = model<CollectionDocument>('Collection', CollectionSchema);
