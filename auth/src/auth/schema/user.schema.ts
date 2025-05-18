import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';

export type UserDocument = User & Document;

@Schema({timestamps: true})
export class User {
    @Prop({required: true, unique: true})
    email: string;

    @Prop({required: true})
    password: string;

    @Prop({default: 'USER', enum: ['USER', 'ADMIN']})
    role: 'USER' | 'ADMIN';

    @Prop({required: true})
    nickname: string;

    @Prop({unique: true})
    recommendCode: string;
}

export const UserSchema = SchemaFactory.createForClass(User);