import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';
import {RewardType} from './const/reward-type.enum';
import {RewardStatus} from "./const/reward-status.enum";

export type EventWinnerDocument = EventWinner & Document;

@Schema({timestamps: true})
export class EventWinner {
    /** 이벤트 ID */
    @Prop({type: Types.ObjectId, ref: 'Event', required: true})
    eventId: Types.ObjectId;

    /** 유저 ID */
    @Prop({type: Types.ObjectId, ref: 'User', required: true})
    userId: Types.ObjectId;

    /** 응모 기록 ID (EventReq._id) */
    @Prop({type: Types.ObjectId, ref: 'EventRequest', required: true})
    eventReqId: Types.ObjectId;

    /** 보상 타입 (POINT, COUPON, ITEM) */
    @Prop({required: true, enum: RewardType})
    rewardType: RewardType;

    /** 보상 값 (ex. 포인트 수치, 쿠폰 ID, 아이템 ID 등) */
    @Prop({required: true})
    rewardValue: string;

    /** 보상 지급 상태 (WAITING, COMPLETED, CANCELLED) */
    @Prop({required: true, enum: RewardStatus, default: RewardStatus.WAITING})
    status: string;

    /** 당첨 일시 */
    @Prop({default: () => new Date()})
    wonAt: Date;
}

export const EventWinnerSchema = SchemaFactory.createForClass(EventWinner);
