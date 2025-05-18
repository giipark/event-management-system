import {IsEmail, IsNotEmpty, MaxLength, MinLength} from "class-validator";

export class SignupDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @MinLength(6)
    @IsNotEmpty()
    password: string;

    @MaxLength(6, {message: '닉네임은 최대 6글자까지 입력 가능합니다.'})
    @IsNotEmpty()
    nickname: string;
}