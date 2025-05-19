import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';
import {RewardType} from "./const/reward-type.enum";

export type EventBenefitDocument = EventBenefit & Document;

@Schema({timestamps: true})
export class EventBenefit {
    /** 연관된 이벤트 ID */
    @Prop({type: Types.ObjectId, ref: 'Event', required: true})
    eventId: Types.ObjectId;

    /** 보상 타입 (POINT, COUPON, ITEM) */
    @Prop({required: true, enum: RewardType})
    rewardType: RewardType;

    /** 보상 값 (ex. 포인트 수치, 쿠폰ID 등) */
    @Prop({required: true})
    rewardValue: string;

    /** 최대 당첨지급 수량 (0이면 제한 없음)*/
    @Prop({required: true, default: 0})
    quantity: number;

    /** [뽑기형] 당첨 확률 (룰렛/랜덤용, % 단위) */
    @Prop()
    chanceRate?: number;

    /** 생성한 관리자 ID */
    @Prop({type: Types.ObjectId, ref: 'User'})
    createdBy: Types.ObjectId;

    /** 수정한 관리자 ID */
    @Prop({type: Types.ObjectId, ref: 'User'})
    updatedBy: Types.ObjectId;
}

export const EventBenefitSchema = SchemaFactory.createForClass(EventBenefit);
