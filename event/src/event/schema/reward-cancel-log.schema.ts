import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';

export type RewardCancelLogDocument = RewardCancelLog & Document;

@Schema({timestamps: true})
export class RewardCancelLog {
    /** 취소된 당첨 ID (EventWinner._id)  */
    @Prop({type: Types.ObjectId, ref: 'EventWinner', required: true})
    eventWinnerId: Types.ObjectId;

    /** 취소한 관리자 ID */
    @Prop({type: Types.ObjectId, ref: 'User', required: true})
    cancelledBy: Types.ObjectId;

    /** 취소 사유 */
    @Prop({required: true})
    reason: string;

    /** 취소 처리 일시 */
    @Prop({default: () => new Date()})
    cancelledAt: Date;
}

export const RewardCancelLogSchema = SchemaFactory.createForClass(RewardCancelLog);