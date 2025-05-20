import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import {RoleType} from "../../event/schema/const/role-type.enum";

export type UserDocument = User & Document;

@Schema({timestamps: true})
export class User {
    /** 유저 이메일 */
    @Prop({required: true, unique: true})
    email: string;

    /** 비밀번호 */
    @Prop({required: true})
    password: string;

    /** 유저 권한 */
    @Prop({default: RoleType.USER, enum: RoleType})
    role: RoleType;

    /** 유저 닉네임 */
    @Prop({required: true})
    nickname: string;

    /** 추천인코드 */
    @Prop({unique: true})
    recommendCode: string;
}

export const UserSchema = SchemaFactory.createForClass(User);