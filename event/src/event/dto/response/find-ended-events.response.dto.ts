import {ApiProperty} from '@nestjs/swagger';
import {EventType} from '../../schema/const/event-type.enum';
import {EventStatus} from '../../schema/const/event-status.enum';

export class FindEndedEventsResponseDto {
    @ApiProperty({example: '66501234abcd...', description: '이벤트 ID'})
    _id: string;

    @ApiProperty({example: '출석 체크 이벤트', description: '이벤트 제목'})
    title: string;

    @ApiProperty({example: EventType.CHECK, description: '이벤트 유형'})
    type: EventType;

    @ApiProperty({example: EventStatus.ACTIVE, description: '이벤트 상태'})
    status: EventStatus;

    @ApiProperty({example: true, description: '이벤트 종료 여부'})
    isEnded: boolean;

    @ApiProperty({example: '2025-05-20T00:00:00Z', description: '시작일시'})
    startAt: string;

    @ApiProperty({example: '2025-05-20T09:00:00Z', description: '종료일시'})
    endAt: string;

    static from(entity: any): FindEndedEventsResponseDto {
        const dto = new FindEndedEventsResponseDto();
        dto._id = entity._id.toString();
        dto.title = entity.title;
        dto.type = entity.type;
        dto.status = entity.status;
        dto.isEnded = entity.isEnded;
        dto.startAt = entity.startAt?.toISOString();
        dto.endAt = entity.endAt?.toISOString();
        return dto;
    }

    static fromList(entities: any[]): FindEndedEventsResponseDto[] {
        return entities.map(this.from);
    }
}
