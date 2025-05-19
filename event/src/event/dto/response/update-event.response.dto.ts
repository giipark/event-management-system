import {ApiProperty} from '@nestjs/swagger';
import {EventStatus} from '../../schema/const/event-status.enum';
import {EventDocument} from '../../schema/event.schema';

export class UpdateEventResponseDto {
    @ApiProperty({
        example: '664a1234abc999001a2b333c',
        description: '이벤트 ID',
    })
    eventId: string;

    @ApiProperty({
        example: '5월 출석체크 이벤트',
        description: '이벤트 제목',
    })
    title: string;

    @ApiProperty({
        enum: EventStatus,
        example: EventStatus.ACTIVE,
        description: '이벤트 상태',
    })
    status: EventStatus;

    @ApiProperty({
        example: '5월 한 달간 진행되는 출석체크 이벤트입니다.',
        description: '이벤트 설명',
    })
    description?: string;

    @ApiProperty({
        example: false,
        description: '종료 여부',
    })
    isEnded: boolean;

    @ApiProperty({
        example: '2025-05-20T03:15:12.000Z',
        description: '마지막 수정 시각',
    })
    updatedAt: Date;

    static from(event: any): UpdateEventResponseDto {
        const dto = new UpdateEventResponseDto();
        dto.eventId = event._id.toString();
        dto.title = event.title;
        dto.status = event.status;
        dto.description = event.description;
        dto.isEnded = event.isEnded;
        dto.updatedAt = event.updatedAt;
        return dto;
    }
}
