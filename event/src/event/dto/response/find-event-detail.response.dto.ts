import {ApiProperty} from '@nestjs/swagger';
import {EventType} from "../../schema/const/event-type.enum";
import {EventStatus} from "../../schema/const/event-status.enum";
import {ParticipantType} from "../../schema/const/participant-type.enum";
import {ParticipationPolicy} from "../../schema/const/participation-policy.enum";

export class FindEventDetailResponseDto {
    @ApiProperty({example: '664a1234abc999001a2b333c'})
    _id: string;

    @ApiProperty({example: '출석체크 이벤트'})
    title: string;

    @ApiProperty({enum: EventType, example: EventType.CHECK})
    type: string;

    @ApiProperty({enum: EventStatus, example: EventStatus.ACTIVE})
    status: string;

    @ApiProperty({example: false})
    isEnded: boolean;

    @ApiProperty({example: '2024-05-21'})
    startAt: string;

    @ApiProperty({example: '2024-05-30'})
    endAt: string;

    @ApiProperty({example: '<p>이벤트 설명입니다.</p>'})
    description: string;

    @ApiProperty({enum: ParticipantType, example: ParticipantType.NONE})
    participantType: string;

    @ApiProperty({example: ['SMS', 'EMAIL'], required: false})
    alarmTypes?: string[];

    @ApiProperty({example: 3, required: false})
    continuousDaysRequired?: number;

    @ApiProperty({example: 5, required: false})
    totalDaysRequired?: number;

    @ApiProperty({enum: ParticipationPolicy, example: ParticipationPolicy.ONCE})
    participationPolicy: string;

    static from(entity: any): FindEventDetailResponseDto {
        const dto = new FindEventDetailResponseDto();
        dto._id = entity._id.toString();
        dto.title = entity.title;
        dto.type = entity.type;
        dto.status = entity.status;
        dto.isEnded = entity.isEnded;
        dto.startAt = entity.startAt?.toISOString().split('T')[0];
        dto.endAt = entity.endAt?.toISOString().split('T')[0];
        dto.description = entity.description;
        dto.participantType = entity.participantType;
        dto.alarmTypes = entity.alarmTypes;
        dto.continuousDaysRequired = entity.continuousDaysRequired;
        dto.totalDaysRequired = entity.totalDaysRequired;
        dto.participationPolicy = entity.participationPolicy;
        return dto;
    }
}
