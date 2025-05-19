import {IsOptional, IsString, IsEnum, IsBoolean} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';
import {EventStatus} from '../../schema/const/event-status.enum';

export class UpdateEventRequestDto {
    @ApiProperty({
        example: '5월 출석체크 이벤트',
        description: '이벤트 제목',
        required: false,
    })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty({
        example: 'ACTIVE',
        description: '이벤트 상태 (공개/비공개)',
        required: false,
    })
    @IsOptional()
    @IsEnum(EventStatus)
    status?: EventStatus;

    @ApiProperty({
        example: '5월 한 달간 진행되는 출석체크 이벤트입니다.',
        description: '이벤트 설명',
        required: false,
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        example: true,
        description: '종료 여부 (true = 종료)',
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    isEnded?: boolean;
}
