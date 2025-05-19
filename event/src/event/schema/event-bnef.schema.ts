import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';

export type EventBenefitDocument = EventBenefit & Document;

@Schema({timestamps: true})
export class EventBenefit {
    /** 연관된 이벤트 ID */
    @Prop({type: Types.ObjectId, ref: 'Event', required: true})
    eventId: Types.ObjectId;

    /** [참여형] 참여 조건 유형 (QUIZ = 퀴즈 정답 입력, AGREE_ALERT = 알림 동의) */
    @Prop({required: true, enum: ['QUIZ', 'ALARM']})
    participantType: 'QUIZ' | 'ALARM';

    /** [참여형] 퀴즈 정답 (participantType이 QUIZ일 때 사용) */
    @Prop()
    quizAnswer?: string;

    /** [참여형] 알림 동의 항목 (participantType이 ALARM일 때 사용) (예, ['SMS', 'EMAIL', 'POST'] */
    @Prop({type: [String]})
    alarmTypes?: string[];

    /** 최대 당첨자 수 (0이면 제한 없음)*/
    @Prop({required: true, default: 0})
    maxWinners?: number;

    /** [뽑기형] 당첨 확률 (룰렛/랜덤용, % 단위) */
    @Prop()
    chanceRate?: number;

    /** [친구초대형] 초대 기준 인원 */
    @Prop()
    invitationLimit?: number;

    /** [출석체크형] 필요한 출석 일 수 (연속) */
    @Prop()
    checkInDaysRequired?: number;
}

export const EventBenefitSchema = SchemaFactory.createForClass(EventBenefit);
