import { Document, model, Schema } from "mongoose";

export interface Subscription {
    id: string;
    userId: number;

    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
};

export type SubscriptionDocument = Document & Subscription;

const SubscriptionSchema = new Schema(
    {
        userId: {
            type: Number,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true
    }
);

export const SubscriptionModel = model<SubscriptionDocument>('Subscription', SubscriptionSchema);
