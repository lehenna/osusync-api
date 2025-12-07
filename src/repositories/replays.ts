import { ReplayDocument, ReplayModel } from "../models/replay";
import { BaseRepository } from "../lib/repository";

export class ReplaysRepository extends BaseRepository<ReplayDocument> {
    private static instance: ReplaysRepository;

    static getInstance() {
        if (this.instance) return this.instance;
        const newInstance = new ReplaysRepository(ReplayModel);
        this.instance = newInstance;
        return newInstance;
    }
}