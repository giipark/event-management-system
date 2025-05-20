import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';

export type LoginHistDocument = LoginHist & Document;

@Schema({timestamps: true})
export class LoginHist {
    /** 로그인한 유저 ID */
    @Prop({type: Types.ObjectId, ref: 'User', required: true})
    userId: Types.ObjectId;

    /** 로그인한 IP */
    @Prop({required: true})
    ip: string;

    /** user-agent or device info */
    @Prop()
    userAgent?: string;
}

export const LoginHistSchema = SchemaFactory.createForClass(LoginHist);
