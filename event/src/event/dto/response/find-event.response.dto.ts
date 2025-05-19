import {ApiProperty} from '@nestjs/swagger';
import {EventStatus} from "../../schema/const/event-status.enum";
import {EventType} from "../../schema/const/event-type.enum";

export class FindEventResponseDto {
    @ApiProperty({example: '665022...abc', description: '이벤트 ID'})
    _id: string;

    @ApiProperty({example: '출석 체크 5일 이벤트'})
    title: string;

    @ApiProperty({enum: EventType, example: EventType.CHECK})
    type: string;

    @ApiProperty({enum: EventStatus, example: EventStatus.ACTIVE})
    status: string;

    @ApiProperty({example: false})
    isEnded: boolean;

    @ApiProperty({example: '2024-05-20'})
    startDate: string;

    @ApiProperty({example: '2024-05-25'})
    endDate: string;

    static from(entity: any): FindEventResponseDto {
        const dto = new FindEventResponseDto();
        dto._id = entity._id.toString();
        dto.title = entity.title;
        dto.type = entity.type;
        dto.status = entity.status;
        dto.isEnded = entity.isEnded;
        dto.startDate = entity.period?.start?.toISOString().split('T')[0];
        dto.endDate = entity.period?.end?.toISOString().split('T')[0];
        return dto;
    }

    static fromList(entities: any[]): FindEventResponseDto[] {
        return entities.map(FindEventResponseDto.from);
    }
}
