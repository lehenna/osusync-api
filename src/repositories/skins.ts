import { SkinDocument, SkinModel } from "../models/skin";
import { BaseRepository } from "../lib/repository";

export class SkinsRepository extends BaseRepository<SkinDocument> {
    private static instance: SkinsRepository;

    static getInstance() {
        if (this.instance) return this.instance;
        const newInstance = new SkinsRepository(SkinModel);
        this.instance = newInstance;
        return newInstance;
    }
}