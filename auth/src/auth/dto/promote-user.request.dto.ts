import {ApiProperty} from '@nestjs/swagger';

export class PromoteUserRequestDto {
    @ApiProperty({
        example: '682a12bec3188b5329f655b6',
        description: 'MongoDB에서 자동 생성된 사용자 고유 ID',
    })
    _id: string;
}
