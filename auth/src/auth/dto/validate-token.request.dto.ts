import {ApiProperty} from '@nestjs/swagger';

export class ValidateTokenRequestDto {
    @ApiProperty({
        example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        description: 'Access Token'
    })
    headerToken: string;
}
