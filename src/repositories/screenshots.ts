import { ScreenshotDocument, ScreenshotModel } from "../models/screenshot";
import { BaseRepository } from "../lib/repository";

export class ScreenshotsRepository extends BaseRepository<ScreenshotDocument> {
    private static instance: ScreenshotsRepository;

    static getInstance() {
        if (this.instance) return this.instance;
        const newInstance = new ScreenshotsRepository(ScreenshotModel);
        this.instance = newInstance;
        return newInstance;
    }
}