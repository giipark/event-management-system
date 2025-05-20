import {ApiProperty} from "@nestjs/swagger";
import {Exclude, Expose} from "class-transformer";
import {RoleType} from "../../user/schema/const/role-type.enum";

export class UserResponseDto {
    @ApiProperty({
        example: '665bbf4d3a4a0d0cf1a0eaf2',
        description: 'MongoDB에서 자동 생성된 사용자 고유 ID',
    })
    @Expose()
    _id: string;

    @ApiProperty({
        example: 'test@example.com',
        description: '사용자 이메일',
    })
    @Expose()
    email: string;

    @ApiProperty({
        example: 'gipark',
        description: '사용자 닉네임',
    })
    @Expose()
    nickname: string;

    @ApiProperty({
        example: RoleType.USER,
        description: '사용자 역할 (USER 또는 ADMIN)',
        enum: RoleType,
    })
    @Expose()
    role: RoleType;

    @ApiProperty({
        example: 'X69QMA',
        description: '자동 생성된 추천인 코드',
    })
    @Expose()
    recommendCode: string;

    @Exclude()
    password?: string;
}