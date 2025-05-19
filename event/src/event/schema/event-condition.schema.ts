import {Prop, Schema} from "@nestjs/mongoose";
import {Types} from "mongoose";

@Schema({ timestamps: true })
export class EventCondition {
    /** 이벤트 ID */
    @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
    eventId: Types.ObjectId;

    /** [참여형] 참여 조건 유형 (QUIZ, ALARM, NONE 등) */
    @Prop({ required: true, enum: ['QUIZ', 'ALARM', 'NONE'] })
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
}