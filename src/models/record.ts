import { Document, model, Schema } from "mongoose";
import { ModelName } from "../enums/models";
import { RecordAction, RecordStatus } from "../enums/records";

export interface Record {
    id: string;
    userId: number;

    modelId: string;
    modelName: ModelName;

    deviceId: string;

    action: RecordAction;
    status: RecordStatus;

    createdAt: Date;
    updatedAt: Date;
};

export type RecordDocument = Document & Record;

const RecordSchema = new Schema(
    {
        userId: {
            type: Number,
            required: true,
        },
        modelId: {
            type: Number,
            required: true,
        },
        modelName: {
            type: String,
            required: true,
        },
        action: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
        deviceId: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true
    }
);

export const RecordModel = model<RecordDocument>('Record', RecordSchema);
