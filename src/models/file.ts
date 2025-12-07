import { Document, model, Schema } from "mongoose";

export interface FileObject {
    id: string;
    userIds: number[];
    name: string;
    hash: string;
    size: number;

    createdAt: Date;
    updatedAt: Date;
};

export type FileObjectDocument = Document & FileObject;

const FileObjectSchema = new Schema(
    {
        userIds: [
            {
                type: Number,
                required: true,

            },
        ],
        name: {
            type: String,
            required: true,
        },
        hash: {
            type: String,
            required: true,
        },
        size: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true
    }
);

export const FileObjectModel = model<FileObjectDocument>('FileObject', FileObjectSchema);
