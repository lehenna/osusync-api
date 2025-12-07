import { DeviceDocument } from "../models/device"
import { DevicesRepository } from "../repositories/devices"

export async function validateDeviceToken(deviceToken: string): Promise<DeviceDocument | null> {
    const [userId, os, serial] = deviceToken.split(':')

    const deviceRepository = DevicesRepository.getInstance()

    const device = await deviceRepository.findOne({
        serial,
        os,
    })

    if (!device) return null

    if (device.userId !== Number(userId)) return null

    return device
}