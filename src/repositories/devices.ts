import { DeviceDocument, DeviceModel } from "../models/device";
import { BaseRepository } from "../lib/repository";

export class DevicesRepository extends BaseRepository<DeviceDocument> {
    private static instance: DevicesRepository;

    static getInstance() {
        if (this.instance) return this.instance;
        const newInstance = new DevicesRepository(DeviceModel);
        this.instance = newInstance;
        return newInstance;
    }
}