import {ApiProperty} from '@nestjs/swagger';
import {EventType} from '../schema/const/event-type.enum';
import {EventStatus} from '../schema/const/event-status.enum';

export class CreateEventResponseDto {
    @ApiProperty({description: '생성된 이벤트 ID'})
    eventId: string;

    @ApiProperty({description: '이벤트 제목'})
    title: string;

    @ApiProperty({description: '이벤트 유형'})
    type: EventType;

    @ApiProperty({description: '이벤트 상태'})
    status: EventStatus;

    @ApiProperty({description: '이벤트 시작일시', type: String, format: 'date-time'})
    startAt: Date;

    @ApiProperty({description: '이벤트 종료일시', type: String, format: 'date-time'})
    endAt: Date;

    @ApiProperty({description: '이벤트 생성일시', type: String, format: 'date-time'})
    createdAt: Date;

    static from(event: any): CreateEventResponseDto {
        const dto = new CreateEventResponseDto();
        dto.eventId = event._id.toString();
        dto.title = event.title;
        dto.type = event.type;
        dto.status = event.status;
        dto.startAt = event.startAt;
        dto.endAt = event.endAt;
        dto.createdAt = event.createdAt;
        return dto;
    }
}