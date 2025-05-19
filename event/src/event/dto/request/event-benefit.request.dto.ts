import {RewardType} from "../../schema/const/reward-type.enum";
import {IsEnum, IsNumber, IsOptional, IsString} from "class-validator";

export class EventBenefitRequestDto {
    /** 보상 타입 */
    @IsEnum(RewardType)
    rewardType: RewardType;

    /** 보상 값 (ex: 포인트 수치, 쿠폰 ID 등) */
    @IsString()
    rewardValue: string;

    /** 보상 수량 (0 = 무제한) */
    @IsNumber()
    quantity: number;

    /** 룰렛 확률 (%) */
    @IsOptional()
    @IsNumber()
    chanceRate?: number;
}
