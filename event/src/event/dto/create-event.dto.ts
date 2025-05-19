import {IsArray, IsDateString, IsEnum, IsNumber, IsOptional, IsString, ValidateNested} from 'class-validator';
import {EventType} from '../schema/const/event-type.enum';
import {EventStatus} from '../schema/const/event-status.enum';
import {EventBenefitDto} from "./event-benefit.dto";
import {Type} from "class-transformer";

export class CreateEventDto {
    /** 이벤트 제목 */
    @IsString()
    title: string;

    /** 이벤트 유형 */
    @IsEnum(EventType)
    type: EventType;

    /** 공개 여부 (ACTIVE / INACTIVE) */
    @IsEnum(EventStatus)
    status: EventStatus;

    /** 이벤트 설명 (optional) */
    @IsOptional()
    @IsString()
    description?: string;

    /** 시작일 (ISO 형식) */
    @IsDateString()
    startAt: string;

    /** 종료일 */
    @IsDateString()
    endAt: string;

    /** 참여 제한 정책 */
    @IsEnum(['ONCE', 'ONCE_PER_DAY'])
    participationPolicy: 'ONCE' | 'ONCE_PER_DAY';

    /** 참여 조건 유형 (QUIZ, ALARM, NONE) */
    @IsEnum(['QUIZ', 'ALARM', 'NONE'])
    participantType: 'QUIZ' | 'ALARM' | 'NONE';

    /** 퀴즈 정답 (QUIZ일 때) */
    @IsOptional()
    @IsString()
    quizAnswer?: string;

    /** 알림 동의 항목 리스트 (ALARM일 때) */
    @IsOptional()
    @IsArray()
    @IsString({each: true})
    alarmTypes?: string[];

    /** 연속 출석 일수 기준 */
    @IsOptional()
    @IsNumber()
    continuousDaysRequired?: number;

    /** 누적 출석 일수 기준 */
    @IsOptional()
    @IsNumber()
    totalDaysRequired?: number;

    /** 보상 목록 */
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => EventBenefitDto)
    benefits: EventBenefitDto[]
}
