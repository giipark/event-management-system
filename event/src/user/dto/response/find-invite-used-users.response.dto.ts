import {ApiProperty} from '@nestjs/swagger';

export class FindInviteUsedUsersResponseDto {
    @ApiProperty({ example: 'user@example.com', description: '초대한 유저 이메일' })
    email: string;

    @ApiProperty({ example: '2025-05-19T12:00:00Z', description: '참여 일시' })
    joinedAt: string;

    static from(entity: any): FindInviteUsedUsersResponseDto {
        const dto = new FindInviteUsedUsersResponseDto();
        dto.email = entity.user?.email;
        dto.joinedAt = entity.joinedAt?.toISOString();
        return dto;
    }

    static fromList(entities: any[]): FindInviteUsedUsersResponseDto[] {
        return entities.map(this.from);
    }
}
