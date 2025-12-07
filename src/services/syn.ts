import { StatusCode } from "../enums/status-code"
import { APIError } from "../lib/error"
import { DeviceDocument } from "../models/device"
import { FileObjectsRepository } from "../repositories/files"
import { StorageService } from "./storage"
import { getBase64Size } from "../utils/files"
import { getHashFromBase64 } from "../utils/hashes"
import { PermissionUtils } from "../utils/permission"
import { BaseRepository } from "../lib/repository"
import { Document } from "mongoose"

interface BaseModel extends Document {
    userId: number
    createdAt: Date
    updatedAt: Date

    // Soft Delete
    deletedAt?: Date
    isDeleted?: boolean

    osuId?: number
    osuContent?: object
    storageId?: string
}

interface SearchOptions {
    userId: number
    pagination?: {
        page: number
        paginate: number
        initDate: number
    }
}

interface DeleteFileOptions {
    storageId: string
    userId: number
}

interface CreateFileOptions {
    device: DeviceDocument
    base64: string
}

type DeleteOptions = {
    device: DeviceDocument
    osuId: number
} | {
    device: DeviceDocument
    storageId: string
}

type CreateOptions = {
    device: DeviceDocument
    osuContent: object
    osuId: number
} | {
    device: DeviceDocument
    storageId: string
} | {
    storageId?: string
    device: DeviceDocument
    osuContent: object
    osuId: number
}

export class SyncService {
    private static instance: SyncService

    static getInstance() {
        return this.instance
    }

    static initialize() {
        const newInstance = new SyncService()
        this.instance = newInstance
    }

    async search<T extends BaseModel>(repository: BaseRepository<T>, { userId, pagination }: SearchOptions) {
        return await repository.find({
            userId: userId,
            updatedAt: pagination ? { $gte: pagination.initDate } : undefined,
        }, pagination ? {
            offset: (pagination.page - 1) * pagination.paginate,
            limit: pagination.paginate,
        } : {})
    }

    async delete<T extends BaseModel>(repository: BaseRepository<T>, { device, ...options }: DeleteOptions) {
        if ("storageId" in options) {
            const document = await repository.findOne({
                userId: device.userId,
                storageId: options.storageId,
            })
            if (!document) return null
            await document.updateOne({
                isDeleted: true,
                deletedAt: new Date(Date.now()),
            })
            return document
        }
        const document = await repository.findOne({
            userId: device.userId,
            osuId: options.osuId,
        })
        if (!document) return null
        await document.updateOne({
            isDeleted: true,
            deletedAt: new Date(Date.now()),
        })
        return document
    }

    async create<T extends BaseModel>(repository: BaseRepository<T>, { device, ...options }: CreateOptions) {
        if ("storageId" in options && "osuId" in options) {
            const document = await repository.findOne({
                userId: device.userId,
                storageId: options.storageId,
            })
            if (!document) {
                const newDocument = await repository.create({
                    storageId: options.storageId,
                    userId: device.userId,
                    osuId: options.osuId,
                    osuContent: options.osuContent,
                } as Partial<T>)
                return newDocument
            }
            document.storageId = options.storageId
            await document.save()
            return document
        }
        if ("storageId" in options) {
            const document = await repository.findOne({
                userId: device.userId,
                storageId: options.storageId,
            })
            if (!document) {
                const newDocument = await repository.create({
                    storageId: options.storageId,
                    userId: device.userId,
                } as Partial<T>)
                return newDocument
            }
            document.storageId = options.storageId
            await document.save()
            return document
        }
        const document = await repository.findOne({
            userId: device.userId,
            osuId: options.osuId,
        })
        if (!document) {
            const newDocument = await repository.create({
                userId: device.userId,
                osuId: options.osuId,
                osuContent: options.osuContent,
            } as Partial<T>)
            return newDocument
        }
        document.osuContent = options.osuContent
        await document.save()
        return document
    }

    async deletFile({ userId, storageId }: DeleteFileOptions) {
        const fileObjectRepository = FileObjectsRepository.getInstance()
        const storage = StorageService.getInstance()

        const document = await fileObjectRepository.findOne({
            id: storageId,
        })
        if (!document) return

        if (!document.userIds.includes(userId)) return

        const userIdIndex = document.userIds.findIndex((i) => i === userId)
        document.userIds.splice(userIdIndex, 1)
        await document.save()

        if (document.userIds.length > 0) return

        await storage.removeFile(document.hash)
        await document.deleteOne()

    }

    async createFile({ device, base64 }: CreateFileOptions) {
        const isProMember = await PermissionUtils.isProMember(device.userId)
        if (!isProMember) {
            throw new APIError(
                "Permission denied",
                StatusCode.Forbidden,
                ["You do not have an active subscription"]
            )
        }

        const fileObjectRepository = FileObjectsRepository.getInstance()
        const storage = StorageService.getInstance()
        const fileHash = getHashFromBase64(base64)

        await storage.saveFile(fileHash, base64)
        const fileSize = getBase64Size(base64)

        const fileObject = await fileObjectRepository.findOne({ hash: fileHash })

        if (!fileObject) {
            const newFileObject = await fileObjectRepository.create({
                hash: fileHash,
                size: fileSize,
                name: fileHash,
                userIds: [device.userId],
            })
            return {
                id: newFileObject.id,
                name: newFileObject.name,
                hash: newFileObject.hash,
                size: newFileObject.size,
            }
        }

        const result = {
            id: fileObject.id,
            name: fileObject.name,
            hash: fileObject.hash,
            size: fileObject.size,
        }

        if (fileObject.userIds.includes(device.userId)) return result
        fileObject.userIds.push(device.userId)
        await fileObject.save()

        return result
    }
}
