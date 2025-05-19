import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindEventParticipantsRequestDto {
    @ApiPropertyOptional({ example: '664fa13d7ce8f8829df5187a', description: '조회할 이벤트 ID (없으면 전체)' })
    eventId?: string;

    @ApiPropertyOptional({ example: 'desc', description: '정렬 방향' })
    order?: 'asc' | 'desc';
}