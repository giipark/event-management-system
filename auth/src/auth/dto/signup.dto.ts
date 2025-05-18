import {IsEmail, IsNotEmpty, MaxLength, MinLength} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class SignupDto {
    @ApiProperty({
        example: 'test@example.com',
        description: '이메일 (로그인 ID)',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: '!Q2w3e4r',
        description: '비밀번호',
    })
    @MinLength(6)
    @IsNotEmpty()
    password: string;

    @ApiProperty({
        example: 'gipark',
        description: '닉네임',
    })
    @MaxLength(6, {message: '닉네임은 최대 6글자까지 입력 가능합니다.'})
    @IsNotEmpty()
    nickname: string;
}