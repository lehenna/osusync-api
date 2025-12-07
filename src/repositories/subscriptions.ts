import { SubscriptionDocument, SubscriptionModel } from "../models/subscription";
import { BaseRepository } from "../lib/repository";

export class SubscriptionsRepository extends BaseRepository<SubscriptionDocument> {
    private static instance: SubscriptionsRepository;

    static getInstance() {
        if (this.instance) return this.instance;
        const newInstance = new SubscriptionsRepository(SubscriptionModel);
        this.instance = newInstance;
        return newInstance;
    }
}