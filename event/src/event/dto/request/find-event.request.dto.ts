import {ApiPropertyOptional} from '@nestjs/swagger';
import {EventStatus} from "../../schema/const/event-status.enum";

export class FindEventRequestDto {
    @ApiPropertyOptional({example: '출석', description: '이벤트 제목 검색어 (부분 매칭)'})
    title?: string;

    @ApiPropertyOptional({example: 'CHECK', description: '이벤트 유형 (ex: CHECK, PARTICIPANT, ...) '})
    type?: string;

    @ApiPropertyOptional({enum: EventStatus, example: EventStatus.ACTIVE, description: '상태 (ACTIVE / INACTIVE)'})
    status?: string;

    @ApiPropertyOptional({example: '2024-05-01', description: '이벤트 시작일 (YYYY-MM-DD)'})
    startDate?: string;

    @ApiPropertyOptional({example: '2024-05-30', description: '이벤트 종료일 (YYYY-MM-DD)'})
    endDate?: string;

    @ApiPropertyOptional({example: false, description: '종료 여부 (false: 진행중)'})
    isEnded?: boolean;
}
