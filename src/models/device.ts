import { Document, model, Schema } from "mongoose";

export interface Device {
    id: string;
    userId: number;
    os: string;
    name: string;
    serial: string;
    hash: string;

    lastConnection: Date;

    createdAt: Date;
    updatedAt: Date;
};

export type DeviceDocument = Document & Device;

const DeviceSchema = new Schema(
    {
        userId: {
            type: Number,
            required: true,
        },
        os: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        serial: {
            type: String,
            required: true,
        },
        hash: {
            type: String,
            required: true,
        },
        lastConnection: {
            type: Date,
            default: new Date(Date.now())
        },
    },
    {
        timestamps: true
    }
);

export const DeviceModel = model<DeviceDocument>('Device', DeviceSchema);
