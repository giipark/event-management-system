import {ApiProperty} from '@nestjs/swagger';
import {RewardType} from "../../schema/const/reward-type.enum";
import {EventStatus} from "../../schema/const/event-status.enum";

export class CreateBenefitResponseDto {
    @ApiProperty({
        example: '6650123a98e01a729ae3f812',
        description: 'MongoDB에서 자동 생성된 고유 ID',
    })
    _id: string;

    @ApiProperty({example: '6650113a78e21a729ae3f812', description: '이벤트 ID'})
    eventId: string;

    @ApiProperty({enum: RewardType, example: RewardType.POINT, description: '보상 타입 (예: POINT, COUPON, ITEM)'})
    rewardType: string;

    @ApiProperty({example: 100, description: '보상 값'})
    rewardValue: number;

    @ApiProperty({example: 10, description: '지급 수량 (0은 무제한)'})
    quantity: number;

    static from(entity: any): CreateBenefitResponseDto {
        const dto = new CreateBenefitResponseDto();
        dto._id = entity._id.toString();
        dto.eventId = entity.eventId;
        dto.rewardType = entity.rewardType;
        dto.rewardValue = entity.rewardValue;
        dto.quantity = entity.quantity;
        return dto;
    }

    static fromList(entities: any[]): CreateBenefitResponseDto[] {
        return entities.map(CreateBenefitResponseDto.from);
    }
}