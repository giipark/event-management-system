import {ApiProperty} from '@nestjs/swagger';

export class CancelRewardRequestDto {
    @ApiProperty({example: '6650a123abcd...', description: '당첨자 ID'})
    eventWinnerId: string;

    @ApiProperty({example: '부정 응모로 인한 취소', description: '취소 사유'})
    reason: string;
}
