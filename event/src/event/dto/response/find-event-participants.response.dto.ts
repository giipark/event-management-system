import {ApiProperty} from '@nestjs/swagger';

export class FindEventParticipantsResponseDto {
    @ApiProperty({example: '664fa13d7ce8f8829df5187a', description: '유저 ID'})
    userId: string;

    @ApiProperty({example: 'user@example.com', description: '유저 Email'})
    email: string;

    @ApiProperty({example: '2024-05-21T12:30:00Z', description: '이벤트 참여 일시'})
    participatedAt: string;

    @ApiProperty({example: '20250519,20250520', required: false, description: '출석체크 일시'})
    attendanceDates?: string;

    @ApiProperty({example: 'ABC123XYZ', required: false, description: '등록한 초대코드'})
    usedInviteCode?: string;

    static from(entity: any): FindEventParticipantsResponseDto {
        const dto = new FindEventParticipantsResponseDto();
        dto.userId = entity.userId?.toString();
        dto.email = entity.user?.email;
        dto.participatedAt = entity.joinedAt?.toISOString();

        if (Array.isArray(entity.attendanceDates)) {
            dto.attendanceDates = entity.attendanceDates.join(',');
        }

        dto.usedInviteCode = entity.usedInviteCode;
        return dto;
    }

    static fromList(entities: any[]): FindEventParticipantsResponseDto[] {
        return entities.map(FindEventParticipantsResponseDto.from);
    }
}
