import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';

export type EventRequestDocument = EventRequest & Document;

@Schema({timestamps: true})
export class EventRequest {
    /** 이벤트 ID */
    @Prop({type: Types.ObjectId, ref: 'Event', required: true})
    eventId: Types.ObjectId;

    /** 유저 ID */
    @Prop({type: Types.ObjectId, ref: 'User', required: true})
    userId: Types.ObjectId;

    /** 참여 일시 (createdAt은 자동생성 기록용 / 직접 사용하기위해선 컬럼 추가) */
    @Prop({default: () => new Date()})
    joinedAt: Date;

    /** [참여형] 유저가 입력한 정답 */
    @Prop()
    quizAnswer?: string;

    /** [출석체크형] 출석한 날짜 (YYYYMMDD 형식 문자열) */
    @Prop({type: String})
    attendanceDates?: string;

    /** [친구초대형] 사용한 초대코드 */
    @Prop()
    usedInviteCode?: string;
}

export const EventRequestSchema = SchemaFactory.createForClass(EventRequest);
