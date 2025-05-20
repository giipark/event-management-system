import {ApiProperty} from '@nestjs/swagger';
import {EventType} from "../../../event/schema/const/event-type.enum";
import {EventStatus} from "../../../event/schema/const/event-status.enum";

export class FindMyEventsResponseDto {
    @ApiProperty({example: '66501234abcd...', description: '이벤트 ID'})
    _id: string;

    @ApiProperty({example: '출석체크 5일 챌린지', description: '이벤트 제목'})
    title: string;

    @ApiProperty({enum: EventType, example: EventType.CHECK, description: '이벤트 유형'})
    type: EventType;

    @ApiProperty({example: '매일 접속하면 포인트를 드립니다!', description: '이벤트 설명'})
    description: string;

    @ApiProperty({enum: EventStatus, example: EventStatus.ACTIVE, description: '이벤트 공개 상태'})
    status: EventStatus;

    @ApiProperty({example: '2024-05-10T00:00:00Z', description: '시작일시'})
    startAt: string;

    @ApiProperty({example: '2024-05-20T00:00:00Z', description: '종료일시'})
    endAt: string;

    @ApiProperty({example: false, description: '이벤트 종료 여부'})
    isEnded: boolean;

    static from(event: any): FindMyEventsResponseDto {
        const dto = new FindMyEventsResponseDto();
        dto._id = event._id.toString();
        dto.title = event.title;
        dto.type = event.type;
        dto.description = event.description ?? '';
        dto.status = event.status;
        dto.startAt = event.startAt?.toISOString();
        dto.endAt = event.endAt?.toISOString();
        dto.isEnded = event.isEnded ?? false;
        return dto;
    }

    static fromList(events: any[]): FindMyEventsResponseDto[] {
        return events.map(this.from);
    }
}
