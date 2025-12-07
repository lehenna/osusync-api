import { PaymentDocument, PaymentModel } from "../models/payment";
import { BaseRepository } from "../lib/repository";

export class PaymentsRepository extends BaseRepository<PaymentDocument> {
    private static instance: PaymentsRepository;

    static getInstance() {
        if (this.instance) return this.instance;
        const newInstance = new PaymentsRepository(PaymentModel);
        this.instance = newInstance;
        return newInstance;
    }
}