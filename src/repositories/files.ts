import { FileObjectDocument, FileObjectModel } from "../models/file";
import { BaseRepository } from "../lib/repository";

export class FileObjectsRepository extends BaseRepository<FileObjectDocument> {
    private static instance: FileObjectsRepository;

    static getInstance() {
        if (this.instance) return this.instance;
        const newInstance = new FileObjectsRepository(FileObjectModel);
        this.instance = newInstance;
        return newInstance;
    }
}