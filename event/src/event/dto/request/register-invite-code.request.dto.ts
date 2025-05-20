import {ApiProperty} from '@nestjs/swagger';

export class RegisterInviteCodeRequestDto {
    @ApiProperty({example: 'X26MNS', description: '사용 할 친구 초대 코드'})
    usedInviteCode: string;
}
