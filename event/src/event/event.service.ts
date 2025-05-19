import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectConnection, InjectModel} from "@nestjs/mongoose";
import {ClientSession, Connection, Model} from "mongoose";
import {Event, EventDocument} from "./schema/event.schema";
import {EventBenefit, EventBenefitDocument} from "./schema/event-bnef.schema";
import {CreateEventRequestDto} from "./dto/request/create-event.request.dto";
import {CreateEventResponseDto} from "./dto/response/create-event.response.dto";
import {UpdateEventRequestDto} from "./dto/request/update-event.request.dto";
import {UpdateEventResponseDto} from "./dto/response/update-event.response.dto";
import {CreateBenefitRequestDto} from "./dto/request/create-benefit.request.dto";
import {CreateBenefitResponseDto} from "./dto/response/create-benefit.response.dto";
import {FindEventRequestDto} from "./dto/request/find-event.request.dto";
import {RoleType} from "./schema/const/role-type.enum";
import {FindEventResponseDto} from "./dto/response/find-event.response.dto";
import {EventStatus} from "./schema/const/event-status.enum";
import {FindEventDetailResponseDto} from "./dto/response/find-event-detail.response.dto";

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

    /**
     * 이벤트 목록 조회
     * @param query
     * @param role
     */
    async findEventList(query: FindEventRequestDto, role: RoleType) {
        const condition: any = {};

        // 검색 조건
        if (query.title) condition.title = { $regex: query.title, $options: 'i' };
        if (query.type) condition.type = query.type;
        if (query.status) condition.status = query.status;
        if (query.isEnded !== undefined) condition.isEnded = query.isEnded;

        // 이벤트 기간 조건 필터 (조회기간 범위 지정)
        if (query.startDate || query.endDate) {
            condition.startAt = {};

            if (query.startDate) condition.startAt.$gte = new Date(query.startDate);
            if (query.endDate) condition.startAt.$lte = new Date(query.endDate);
        }

        // USER 권한 제한 추가 필터
        if (role === RoleType.USER) {
            condition.status = EventStatus.ACTIVE;
            condition.isEnded = false;

            // 기간 내 포함된 이벤트만
            const today = new Date();
            condition.startAt = { $lte: today };
            condition.endAt = { $gte: today };
        }

        const events = await this.eventModel.find(condition).sort({ createdAt: -1 }).lean();
        return FindEventResponseDto.fromList(events);
    }

    /**
     * 이벤트 상세조회
     * @param id
     * @param role
     */
    async findEventDetail(id: string, role: RoleType): Promise<FindEventDetailResponseDto> {
        const condition: any = { _id: id };

        if (role === RoleType.USER) {
            condition.status = EventStatus.ACTIVE;
            condition.isEnded = false;

            // 기간 내 포함된 이벤트만
            const today = new Date();
            condition.startAt = { $lte: today };
            condition.endAt = { $gte: today };
        }

        const event = await this.eventModel.findOne(condition).lean();
        if (!event) throw new NotFoundException('이벤트를 찾을 수 없습니다.');

        return FindEventDetailResponseDto.from(event);
    }

}
