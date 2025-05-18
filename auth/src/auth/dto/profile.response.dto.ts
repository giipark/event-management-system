import {ApiProperty} from "@nestjs/swagger";

export class ProfileResponseDto {
    @ApiProperty({
        example: '682a12bec3188b5329f655b6',
        description: '유저 고유ID',
    })
    id: string;

    @ApiProperty({
        example: 'test@example.com',
        description: '유저 이메일',
    })
    email: string;

    @ApiProperty({
        example: 'gipark',
        description: '유저 닉네임',
    })
    nickname: string;

    @ApiProperty({
        example: '2025-05-19T06:35:01.123Z',
        description: '회원가입일',
    })
    createdAt: Date;

    static from(user: any): ProfileResponseDto {
        const dto = new ProfileResponseDto();
        dto.id = user._id;
        dto.email = user.email;
        dto.nickname = user.nickname;
        dto.createdAt = user.createdAt;
        return dto;

    }
}