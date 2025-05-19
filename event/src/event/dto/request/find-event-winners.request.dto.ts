import {ApiPropertyOptional} from '@nestjs/swagger';
import {RewardStatus} from "../../schema/const/reward-status.enum";

export class FindEventWinnersRequestDto {
    @ApiPropertyOptional({example: '66501234abcd1234efgh5678', description: '이벤트 ID'})
    eventId?: string;

    @ApiPropertyOptional({enum: RewardStatus, example: RewardStatus.WAITING, description: '보상 지급 상태'})
    status?: RewardStatus;
}
