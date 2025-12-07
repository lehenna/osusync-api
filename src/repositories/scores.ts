import { ScoreDocument, ScoreModel } from "../models/score";
import { BaseRepository } from "../lib/repository";

export class ScoresRepository extends BaseRepository<ScoreDocument> {
    private static instance: ScoresRepository;

    static getInstance() {
        if (this.instance) return this.instance;
        const newInstance = new ScoresRepository(ScoreModel);
        this.instance = newInstance;
        return newInstance;
    }
}