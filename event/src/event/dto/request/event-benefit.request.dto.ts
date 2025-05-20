import {RewardType} from "../../schema/const/reward-type.enum";
import {IsEnum, IsNumber, IsOptional, IsString} from "class-validator";
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";

export class EventBenefitRequestDto {
    @ApiProperty({
        example: RewardType.POINT,
        enum: RewardType,
        description: '보상 타입 (예: POINT, COUPON, ITEM)',
    })
    @IsEnum(RewardType)
    rewardType: RewardType;

    @ApiProperty({
        example: '100',
        description: '보상 값 (예: 포인트 수치, 쿠폰 ID, 아이템 코드 등)',
    })
    @IsString()
    rewardValue: string;

    @ApiProperty({
        example: 10,
        description: '보상 수량 (0 = 무제한)',
    })
    @IsNumber()
    quantity: number;

    @ApiPropertyOptional({
        example: 50,
        description: '룰렛 확률 (%) (ROULETTE 타입에서 사용)',
    })
    @IsOptional()
    @IsNumber()
    chanceRate?: number;
}
