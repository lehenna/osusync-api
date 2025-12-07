import { BeatmapDocument, BeatmapModel } from "../models/beatmap";
import { BaseRepository } from "../lib/repository";

export class BeatmapsRepository extends BaseRepository<BeatmapDocument> {
    private static instance: BeatmapsRepository;

    static getInstance() {
        if (this.instance) return this.instance;
        const newInstance = new BeatmapsRepository(BeatmapModel);
        this.instance = newInstance;
        return newInstance;
    }
}