import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';
import {EventType} from "./const/event-type.enum";
import {EventStatus} from "./const/event-status.enum";

export type EventDocument = Event & Document;

@Schema({timestamps: true})
export class Event {
    /** 이벤트 제목 */
    @Prop({required: true})
    title: string;

    /** 이벤트 유형 */
    @Prop({required: true, enum: EventType})
    type: EventType;

    /** 이벤트 상태 (공개, 비공개) */
    @Prop({required: true, enum: EventStatus, default: EventStatus.INACTIVE})
    status: EventStatus;

    /** 이벤트 시작일시 */
    @Prop({required: true})
    startAt: Date;

    /** 이벤트 종료일시 */
    @Prop({required: true})
    endAt: Date;

    /** 이벤트 설명 (이미지, HTML, 내용 등) - 업로드기능 추가시, 이미지 컬럼 따로 만들어서 사용 */
    @Prop()
    description: string;

    /** [참여형] 참여 조건 유형 (QUIZ, ALARM, NONE 등) */
    @Prop({ required: true, enum: ['QUIZ', 'ALARM', 'NONE'], default: 'NONE' })
    participantType: 'QUIZ' | 'ALARM' | 'NONE';

    /** [참여형] 퀴즈 정답 (QUIZ일 때만) */
    @Prop()
    quizAnswer?: string;

    /** [참여형] 알람 동의 항목 (ALARM일 때만) */
    @Prop({ type: [String] })
    alarmTypes?: string[];

    /** [출석체크형] 연속 출석 일수 기준 */
    @Prop()
    continuousDaysRequired?: number;

    /** [출석체크형] 누적 출석 일수 기준 */
    @Prop()
    totalDaysRequired?: number;

    /** 이벤트 참여 제한 정책 (ONCE, ONCE_PER_DAY) */
    @Prop({ enum: ['ONCE', 'ONCE_PER_DAY'], default: 'ONCE' })
    participationPolicy: 'ONCE' | 'ONCE_PER_DAY';

    /** 이벤트 종료 여부 */
    @Prop({default: false})
    isEnded: boolean;

    /** 생성한 관리자 ID */
    @Prop({type: Types.ObjectId, ref: 'User'})
    createdBy: Types.ObjectId;

    /** 수정한 관리자 ID */
    @Prop({type: Types.ObjectId, ref: 'User'})
    updatedBy: Types.ObjectId;
}

export const EventSchema = SchemaFactory.createForClass(Event);
