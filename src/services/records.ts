import { ModelName } from "../enums/models";
import { RecordAction, RecordStatus } from "../enums/records";
import { RecordDocument } from "../models/record";
import { DevicesRepository } from "../repositories/devices";
import { RecordRepository } from "../repositories/record";
import { PermissionUtils } from "../utils/permission";

interface CreateOptions {
    userId: number

    modelId: string
    modelName: ModelName
    action: RecordAction

    omitDevices?: string[]
}

interface SearchOptions {
    userId: number
    deviceId: number
}

interface CompleteOptions {
    userId: number
    recordId: string
}

export class RecordService {
    private static instance: RecordService;

    static getInstance() {
        return this.instance;
    }

    static initialize() {
        const newInstance = new RecordService();
        this.instance = newInstance;
    }

    async search({ userId, deviceId }: SearchOptions) {
        const isProMember = await PermissionUtils.isProMember(userId)
        const recordRepository = RecordRepository.getInstance()
        const records = await recordRepository.find({
            deviceId,
            userId,
            status: RecordStatus.Pending,
        }, {
            offset: 0,
            limit: isProMember ? 100 : 50,
        })
        return records
    }

    async complete({ recordId, userId }: CompleteOptions) {
        const recordRepository = RecordRepository.getInstance()
        const record = await recordRepository.delete({ id: recordId })
        if (!record || record.userId !== userId) return
        record.status = RecordStatus.Completed
        await record.save()
    }

    async create({ action, userId, modelId, modelName, omitDevices = [] }: CreateOptions) {
        const devicesRepository = DevicesRepository.getInstance()
        const recordRepository = RecordRepository.getInstance()
        const devices = await devicesRepository.find({ userId })

        const pendingRecords = await recordRepository.find({
            userId,
            modelId,
            modelName,
            status: RecordStatus.Pending,
        })

        for (const pendingRecord of pendingRecords) {
            await pendingRecord.updateOne({
                action: RecordAction.Delete,
            })
            omitDevices.push(pendingRecord.deviceId)
        }

        const records: RecordDocument[] = []

        for (const device of devices) {
            if (omitDevices.includes(device.id)) continue
            const newRecord = await recordRepository.create({
                action,
                modelId,
                modelName,
                status: RecordStatus.Pending,
                deviceId: device.id,
                userId,
            })
            records.push(newRecord)
        }

        return records
    }
}