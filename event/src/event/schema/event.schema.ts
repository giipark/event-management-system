import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';
import {EventType} from "./const/event-type.enum";
import {EventStatus} from "./const/event-status.enum";
import {RewardType} from "./const/reward-type.enum";

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

    /** 이벤트 보상 유형 */
    @Prop({required: true, enum: RewardType})
    rewardType: RewardType;

    /** 이벤트 보상 내용 */
    @Prop({required: true})
    rewardValue: string;

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
