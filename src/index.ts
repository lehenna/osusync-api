import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { createServer } from "http"
import { Server } from 'socket.io';
import { Websocket } from './websocket';
import { config } from './config';
import { OsuAPIService } from './services/osu';
import { StorageService } from './services/storage';
import { errorHandler } from './middlewares/error-handler';
import { RecordService } from './services/records';
import { SyncService } from './services/syn';

async function bootstrap() {
    const app = express();

    app.use(morgan("short"));
    app.use(cors());
    app.use(errorHandler);

    const server = createServer(app);
    const io = new Server(server);

    Websocket.initialize(io);

    // Inicializar singleton de servicios
    OsuAPIService.initialize(config.osu);
    StorageService.initialize(config.r2);
    RecordService.initialize()
    SyncService.initialize()

    server.listen(config.port);
}

bootstrap().catch((error) => {
    console.error(error)
})