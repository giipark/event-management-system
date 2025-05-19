import {ApiProperty} from '@nestjs/swagger';
import {RewardType} from "../../schema/const/reward-type.enum";

export class CreateBenefitRequestDto {
    @ApiProperty({enum: RewardType, example: RewardType.POINT, description: '보상 타입 (예: POINT, COUPON, ITEM)'})
    rewardType: string;

    @ApiProperty({example: 100, description: '보상 값'})
    rewardValue: number;

    @ApiProperty({example: 10, description: '지급 수량 (0은 무제한)'})
    quantity: number;
}