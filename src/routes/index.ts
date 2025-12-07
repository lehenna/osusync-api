import { Router } from "express";
import { userRoutes } from "./users";
import { oauth2Routes } from "./oauth2";
import { beatmapRoutes } from "./beatmaps";
import { collectionRoutes } from "./collections";
import { deviceRoutes } from "./devices";
import { recordRoutes } from "./records";
import { replayRoutes } from "./replays";
import { scoreRoutes } from "./scores";
import { screenshotRoutes } from "./screenshots";
import { skinRoutes } from "./skins";

const routes = Router()

routes.use('/beatmaps', beatmapRoutes)
routes.use('/collections', collectionRoutes)
routes.use('/devices', deviceRoutes)
routes.use('/records', recordRoutes)
routes.use('/replay', replayRoutes)
routes.use('/scores', scoreRoutes)
routes.use('/screenshots', screenshotRoutes)
routes.use('/skin', skinRoutes)
routes.use('/oauth2', oauth2Routes)
routes.use('/users', userRoutes)

export { routes }