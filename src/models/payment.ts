import { Document, model, Schema } from "mongoose";

export interface Payment {
    id: string;
    userId: number;

    serviceId: string;

    createdAt: Date;
    updatedAt: Date;
};

export type PaymentDocument = Document & Payment;

const PaymentSchema = new Schema(
    {
        userId: {
            type: Number,
            required: true,
        },
        serviceId: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true
    }
);

export const PaymentModel = model<PaymentDocument>('Payment', PaymentSchema);
