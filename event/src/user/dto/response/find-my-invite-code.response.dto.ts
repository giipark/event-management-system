import {ApiProperty} from '@nestjs/swagger';

export class FindMyInviteCodeResponseDto {
    @ApiProperty({example: 'X26NBN', description: '내 초대 코드'})
    recommendCode: string;

    static from(code: string): FindMyInviteCodeResponseDto {
        const dto = new FindMyInviteCodeResponseDto();
        dto.recommendCode = code;
        return dto;
    }
}