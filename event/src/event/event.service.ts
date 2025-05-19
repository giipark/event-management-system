import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectConnection, InjectModel} from "@nestjs/mongoose";
import {ClientSession, Connection, Model} from "mongoose";
import {Event, EventDocument} from "./schema/event.schema";
import {EventBenefit, EventBenefitDocument} from "./schema/event-bnef.schema";
import {CreateEventRequestDto} from "./dto/create-event.request.dto";
import {CreateEventResponseDto} from "./dto/create-event.response.dto";
import {UpdateEventRequestDto} from "./dto/update-event.request.dto";
import {UpdateEventResponseDto} from "./dto/update-event.response.dto";
import {CreateBenefitRequestDto} from "./dto/create-benefit.request.dto";
import {CreateBenefitResponseDto} from "./dto/create-benefit.response.dto";

@Injectable()
export class EventService {
    constructor(
        @InjectModel(Event.name) private eventModel: Model<EventDocument>,
        @InjectModel(EventBenefit.name) private eventBenefitModel: Model<EventBenefitDocument>,
        @InjectConnection() private readonly connection: Connection,
    ) {
    }

    /**
     * 이벤트 생성
     * @param dto
     * @param id
     */
    async createEvent(dto: CreateEventRequestDto, id: string): Promise<CreateEventResponseDto> {
        const session: ClientSession = await this.connection.startSession();
        session.startTransaction();

        try {
            // 이벤트 등록
            const event = new this.eventModel({
                ...dto,
                createdBy: id,
                updatedBy: id,
            });
            const savedEvent = await event.save();

            // 이벤트 보상목록 등록
            if (dto.benefits && dto.benefits.length > 0) {
                const benefits = dto.benefits.map(b => ({
                    ...b,
                    eventId: savedEvent._id,
                    createdBy: id,
                    updatedBy: id,
                }));
                await this.eventBenefitModel.insertMany(benefits);
            }

            await session.commitTransaction();
            await session.endSession();

            return CreateEventResponseDto.from(savedEvent);
        } catch (err) {
            await session.abortTransaction();
            await session.endSession();
            throw err;
        }
    }

    /**
     * 이벤트 수정
     * @param id
     * @param dto
     * @param adminId
     */
    async updateEvent(id: string, dto: UpdateEventRequestDto, adminId: string,): Promise<UpdateEventResponseDto> {
        const updated = await this.eventModel.findByIdAndUpdate(
            id, {
                ...dto,
                updatedBy: adminId,
            },
            {new: true},
        );

        if (!updated) {
            throw new NotFoundException('해당 이벤트를 찾을 수 없습니다.');
        }

        return UpdateEventResponseDto.from(updated);
    }

    /**
     * 이벤트 보상 추가
     * @param eventId
     * @param dtoList
     */
    async addBenefitToEvent(eventId: string, dtoList: CreateBenefitRequestDto[]): Promise<CreateBenefitResponseDto[]> {
        const data = dtoList.map(dto => ({
            eventId,
            rewardType: dto.rewardType,
            rewardValue: dto.rewardValue,
            quantity: dto.quantity,
        }));

        const benefits = await this.eventBenefitModel.insertMany(data); // 배열 저장

        return CreateBenefitResponseDto.fromList(benefits);
    }
}
