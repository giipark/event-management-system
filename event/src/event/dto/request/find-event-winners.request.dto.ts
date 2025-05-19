import {ApiPropertyOptional} from '@nestjs/swagger';

export class FindEventWinnersRequestDto {
    @ApiPropertyOptional({example: '66501234abcd1234efgh5678', description: '이벤트 ID'})
    eventId?: string;
}
