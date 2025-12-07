import { SubscriptionsRepository } from "../repositories/subscriptions";


export class PermissionUtils {
    static async isProMember(userId: number) {
        const subscriptionsRepository = SubscriptionsRepository.getInstance();
        const subscription = await subscriptionsRepository.findOne({ userId });
        return subscription && subscription.expiresAt.getTime() > Date.now() || false;
    }
}