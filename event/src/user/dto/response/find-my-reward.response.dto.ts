import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {RewardType} from '../../../event/schema/const/reward-type.enum';
import {RewardStatus} from '../../../event/schema/const/reward-status.enum';

export class FindMyRewardResponseDto {
    @ApiProperty({example: '66501234abcd...', description: '이벤트 ID'})
    eventId: string;

    @ApiPropertyOptional({enum: RewardType, example: RewardType.POINT, description: '보상 타입 (예: POINT, COUPON, ITEM)'})
    rewardType?: RewardType;

    @ApiPropertyOptional({example: '100', description: '보상 값'})
    rewardValue?: string;

    @ApiPropertyOptional({enum: RewardStatus, example: RewardStatus.COMPLETED, description: '보상 상태'})
    status?: RewardStatus;

    @ApiPropertyOptional({ example: '2024-05-22T12:00:00Z', description: '당첨 일시' })
    wonAt?: string;

    static from(winner: any): FindMyRewardResponseDto {
        const dto = new FindMyRewardResponseDto();
        dto.eventId = winner.eventId.toString();
        dto.rewardType = winner.rewardType;
        dto.rewardValue = winner.rewardValue;
        dto.status = winner.status;
        dto.wonAt = winner.wonAt?.toISOString();
        return dto;
    }

    static empty(eventId: string): FindMyRewardResponseDto {
        const dto = new FindMyRewardResponseDto();
        dto.eventId = eventId;
        return dto;
    }
}
