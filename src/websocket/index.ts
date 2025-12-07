import { Server, Socket } from 'socket.io';
import { WebsocketEvent } from '../enums/websocket';
import { validateDeviceToken } from '../utils/devices';
import { Device } from '../models/device';

export class Websocket {
    private static instance: Websocket;

    static getInstance() {
        if (!this.instance) throw new Error('Websocket not initialized')
        return this.instance;
    }

    static initialize(io: Server) {
        this.instance = new Websocket(io);
    }

    private io: Server;

    private handlers: Record<string, ((socket: Socket, payload: any) => void)[]> = {};

    constructor(io: Server) {
        this.io = io;

        io.use(async (socket, next) => {
            try {
                const authorization = socket.handshake.auth?.authorization;
                if (!authorization) throw new Error('Authorization token is required')
                const device = validateDeviceToken(authorization)
                if (!device) throw new Error('Authorization token is invalid')
                socket.data = {}
                socket.data.device = device
                next()
            } catch (error) {
                next(error as Error)
            }
        })

        this.io.on(WebsocketEvent.Connection, (socket) => {
            const device = socket.data.device as Device

            socket.join(`user::${device.userId}`)
            socket.join(`device::${device.id}`)

            socket.on('message', (raw) => {
                const { event, payload } = JSON.parse(raw);
                this.send(socket, event, payload);
            })
            socket.on('disconnect', () => {
                socket.leave(`user::${device.userId}`)
                socket.leave(`device::${device.id}`)
                this.send(socket, WebsocketEvent.Disconnection, null);
            })
        })
    }

    private send(socket: Socket, event: string, payload: any) {
        const handlers = this.handlers[event];
        for (const handler of handlers) {
            handler(socket, payload)
        }
    }

    emit(room: string, event: string, payload: any) {
        this.io.to(room).emit(event, payload)
    }

    on<T>(event: WebsocketEvent, handler: (socket: Socket, payload: T) => void) {
        if (!this.handlers[event]) this.handlers[event] = [];
        this.handlers[event].push(handler);
    }
}