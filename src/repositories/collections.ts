import { CollectionDocument, CollectionModel } from "../models/collection";
import { BaseRepository } from "../lib/repository";

export class CollectionsRepository extends BaseRepository<CollectionDocument> {
    private static instance: CollectionsRepository;

    static getInstance() {
        if (this.instance) return this.instance;
        const newInstance = new CollectionsRepository(CollectionModel);
        this.instance = newInstance;
        return newInstance;
    }
}