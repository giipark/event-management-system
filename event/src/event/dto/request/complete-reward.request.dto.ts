import {ApiProperty} from '@nestjs/swagger';

export class CompleteRewardRequestDto {
    @ApiProperty({ type: [String], example: ['6650a123...', '6650a456...'], description: '당첨 ID 리스트' })
    eventWinnerIds: string[];
}
