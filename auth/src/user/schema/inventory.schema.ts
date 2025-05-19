import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';

export type InventoryDocument = Inventory & Document;

@Schema({timestamps: true})
export class Inventory {
    /** 유저 ID */
    @Prop({type: Types.ObjectId, ref: 'User', required: true, index: true})
    userId: Types.ObjectId;

    /** 보유 포인트 */
    @Prop({default: 0})
    point: number;

    /** 보유 쿠폰 ID 목록 */
    @Prop({type: [String], default: []})
    coupons: string[];

    /** 보유 아이템 ID 목록 */
    @Prop({type: [String], default: []})
    items: string[];
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
