import {RewardType} from '../../event/schema/const/reward-type.enum';

export function getRewardUpdate(type: RewardType, value: string | number) {
    if (type === RewardType.POINT) {
        return { $inc: { point: parseInt(value.toString(), 10) } };
    } else if (type === RewardType.COUPON) {
        return { $push: { coupons: value } };
    } else if (type === RewardType.ITEM) {
        return { $push: { items: value } };
    }
    return {};
}