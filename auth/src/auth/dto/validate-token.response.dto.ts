import { ApiProperty } from '@nestjs/swagger';

export class ValidateTokenResponseDto {
    @ApiProperty({
        example: '665bbf4d3a4a0d0cf1a0eaf2',
        description: 'MongoDB에서 자동 생성된 사용자 고유 ID',
    })
    _id: string;

    @ApiProperty({
        example: 'test@example.com',
        description: '사용자 이메일',
    })
    email: string;

    static from(payload: any): ValidateTokenResponseDto {
        const dto = new ValidateTokenResponseDto();
        dto._id = payload._id;
        dto.email = payload.email;
        return dto;

    }
}
