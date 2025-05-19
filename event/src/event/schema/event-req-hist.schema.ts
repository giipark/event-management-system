import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';

export type EventRequestHistDocument = EventRequestHist & Document;

@Schema({timestamps: true})
export class EventRequestHist {
    /** 해당 참여내역 ID */
    @Prop({type: Types.ObjectId, ref: 'EventRequest', required: true})
    requestId: Types.ObjectId;

    /** 이벤트 ID (조회 최적화를 위해 중복 저장) */
    @Prop({type: Types.ObjectId, ref: 'Event', required: true})
    eventId: Types.ObjectId;

    /** 유저 ID */
    @Prop({type: Types.ObjectId, ref: 'User', required: true})
    userId: Types.ObjectId;

    /** 변경된 상태 (ex: COMPLETED → CANCELLED) */
    @Prop({required: true})
    status: string;

    /** 변경 사유 또는 상세 설명 (선택) */
    @Prop()
    reason?: string;

    /** 변경 주체 (ex: 'SYSTEM', 'USER', 'ADMIN') */
    @Prop({default: 'SYSTEM'})
    changedBy: string;
}

export const EventRequestHistSchema = SchemaFactory.createForClass(EventRequestHist);
