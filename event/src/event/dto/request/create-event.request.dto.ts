import {IsArray, IsDateString, IsEnum, IsNumber, IsOptional, IsString, ValidateNested} from 'class-validator';
import {EventType} from '../../schema/const/event-type.enum';
import {EventStatus} from '../../schema/const/event-status.enum';
import {EventBenefitRequestDto} from "./event-benefit.request.dto";
import {Type} from "class-transformer";
import {ParticipationPolicy} from "../../schema/const/participation-policy.enum";
import {ParticipantType} from "../../schema/const/participant-type.enum";
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";

export class CreateEventRequestDto {
    @ApiProperty({example: '출석체크 이벤트', description: '이벤트 제목'})
    @IsString()
    title: string;

    @ApiProperty({example: EventType.CHECK, enum: EventType, description: '이벤트 유형'})
    @IsEnum(EventType)
    type: EventType;

    @ApiProperty({example: EventStatus.ACTIVE, enum: EventStatus, description: '공개 여부'})
    @IsEnum(EventStatus)
    status: EventStatus;

    @ApiPropertyOptional({example: '매일 출석시 포인트 지급', description: '이벤트 설명 (선택사항)'})
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({example: '2025-05-21T00:00:00.000Z', description: '이벤트 시작일 (ISO 형식)'})
    @IsDateString()
    startAt: string;

    @ApiProperty({example: '2025-06-01T23:59:59.000Z', description: '이벤트 종료일 (ISO 형식)'})
    @IsDateString()
    endAt: string;

    @ApiProperty({example: ParticipationPolicy.ONCE, enum: ParticipationPolicy, description: '참여 제한 정책'})
    @IsEnum(ParticipationPolicy)
    participationPolicy: ParticipationPolicy;

    @ApiProperty({example: ParticipantType.QUIZ, enum: ParticipantType, description: '참여 조건 유형'})
    @IsEnum(ParticipantType)
    participantType: ParticipantType;

    @ApiPropertyOptional({example: 'MAPLE', description: '퀴즈 정답 (QUIZ일 경우 필수)'})
    @IsOptional()
    @IsString()
    quizAnswer?: string;

    @ApiPropertyOptional({
        example: ['SMS', 'EMAIL'],
        description: '알림 동의 항목 리스트 (ALARM일 경우 필수)',
        type: [String]
    })
    @IsOptional()
    @IsArray()
    @IsString({each: true})
    alarmTypes?: string[];

    @ApiPropertyOptional({example: 5, description: '연속 출석 일수 기준'})
    @IsOptional()
    @IsNumber()
    continuousDaysRequired?: number;

    @ApiPropertyOptional({example: 10, description: '누적 출석 일수 기준'})
    @IsOptional()
    @IsNumber()
    totalDaysRequired?: number;

    @ApiProperty({
        description: '보상 목록',
        type: [EventBenefitRequestDto]
    })
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => EventBenefitRequestDto)
    benefits: EventBenefitRequestDto[]
}
