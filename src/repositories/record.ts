import { BaseRepository } from "../lib/repository";
import { RecordDocument, RecordModel } from "../models/record";

export class RecordRepository extends BaseRepository<RecordDocument> {
    private static instance: RecordRepository;

    static getInstance() {
        if (this.instance) return this.instance;
        const newInstance = new RecordRepository(RecordModel);
        this.instance = newInstance;
        return newInstance;
    }
}