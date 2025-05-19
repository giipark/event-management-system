import {ApiProperty} from '@nestjs/swagger';
import {RewardType} from '../../schema/const/reward-type.enum';
import {RewardStatus} from "../../schema/const/reward-status.enum";

export class FindEventWinnersResponseDto {
    @ApiProperty({example: '6650123a98e01a729ae3f812'})
    userId: string;

    @ApiProperty({example: 'user@example.com'})
    email: string;

    @ApiProperty({example: RewardType.POINT})
    rewardType: RewardType;

    @ApiProperty({example: '100'})
    rewardValue: string;

    @ApiProperty({example: RewardStatus.COMPLETED})
    status: string;

    @ApiProperty({example: '2024-05-21T12:00:00Z'})
    wonAt: string;

    static from(entity: any): FindEventWinnersResponseDto {
        const dto = new FindEventWinnersResponseDto();
        dto.userId = entity.userId?.toString();
        dto.email = entity.user?.email;
        dto.rewardType = entity.rewardType;
        dto.rewardValue = entity.rewardValue;
        dto.status = entity.status;
        dto.wonAt = entity.wonAt?.toISOString();
        return dto;
    }

    static fromList(entities: any[]): FindEventWinnersResponseDto[] {
        return entities.map(FindEventWinnersResponseDto.from);
    }
}
