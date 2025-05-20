import {ApiProperty} from '@nestjs/swagger';

export class CompleteRewardResponseDto {
    @ApiProperty({example: 3, description: '지급 성공 횟수'})
    updatedCount: number;

    static from(data: number): CompleteRewardResponseDto {
        const dto = new CompleteRewardResponseDto();
        dto.updatedCount = data;
        return dto;
    }
}
