import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNotEmpty} from "class-validator";

export class LoginDto {
    @ApiProperty({
        example: 'test@example.com',
        description: '이메일 ID',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: '!Q2w3e4r',
        description: '비밀번호',
    })
    @IsNotEmpty()
    password: string;
}