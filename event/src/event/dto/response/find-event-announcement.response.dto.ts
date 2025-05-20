import {ApiProperty} from '@nestjs/swagger';

export class FindEventAnnouncementResponseDto {
    @ApiProperty({ example: 'us***@email.com', description: '이메일 (마스킹된)' })
    email: string;

    static maskEmail(email: string): string {
        const [local, domain] = email.split('@');
        const visible = local.slice(0, 2);
        const masked = '*'.repeat(Math.max(local.length - 2, 1));
        return `${visible}${masked}@${domain}`;
    }

    static from(entity: any): FindEventAnnouncementResponseDto {
        const dto = new FindEventAnnouncementResponseDto();
        dto.email = this.maskEmail(entity.user?.email);
        return dto;
    }

    static fromList(entities: any[]): FindEventAnnouncementResponseDto[] {
        return entities.map(this.from);
    }
}
