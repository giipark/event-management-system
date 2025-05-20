import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectConnection, InjectModel} from "@nestjs/mongoose";
import {ClientSession, Connection, Model, Types} from "mongoose";
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
import {FindEventParticipantsResponseDto} from "./dto/response/find-event-participants.response.dto";
import {EventRequest, EventRequestDocument} from "./schema/event-req.schema";
import {FindEventParticipantsRequestDto} from "./dto/request/find-event-participants.request.dto";
import {FindEventWinnersRequestDto} from "./dto/request/find-event-winners.request.dto";
import {FindEventWinnersResponseDto} from "./dto/response/find-event-winners.response.dto";
import {EventWinner, EventWinnerDocument} from "./schema/event-winner.schema";
import {RewardStatus} from "./schema/const/reward-status.enum";
import {RewardType} from "./schema/const/reward-type.enum";
import {Inventory, InventoryDocument} from "../user/schema/inventory.schema";
import {CompleteRewardResponseDto} from "./dto/response/complete-reward.response.dto";
import {RewardCancelLog, RewardCancelLogDocument} from "./schema/reward-cancel-log.schema";
import {FindEventAnnouncementResponseDto} from "./dto/response/find-event-announcement.response.dto";

@Injectable()
export class EventService {
    constructor(
        @InjectModel(Event.name) private eventModel: Model<EventDocument>,
        @InjectModel(EventBenefit.name) private eventBenefitModel: Model<EventBenefitDocument>,
        @InjectModel(EventRequest.name) private eventReqModel: Model<EventRequestDocument>,
        @InjectModel(EventWinner.name) private eventWinnerModel: Model<EventWinnerDocument>,
        @InjectModel(Inventory.name) private inventoryModel: Model<InventoryDocument>,
        @InjectModel(RewardCancelLog.name) private rewardCancelLogModel: Model<RewardCancelLogDocument>,
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
        if (query.title) condition.title = {$regex: query.title, $options: 'i'};
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
            condition.startAt = {$lte: today};
            condition.endAt = {$gte: today};
        }

        const events = await this.eventModel.find(condition).sort({createdAt: -1}).lean();
        return FindEventResponseDto.fromList(events);
    }

    /**
     * 이벤트 상세조회
     * @param id
     * @param role
     */
    async findEventDetail(id: string, role: RoleType): Promise<FindEventDetailResponseDto> {
        const condition: any = {_id: id};

        if (role === RoleType.USER) {
            condition.status = EventStatus.ACTIVE;
            condition.isEnded = false;

            // 기간 내 포함된 이벤트만
            const today = new Date();
            condition.startAt = {$lte: today};
            condition.endAt = {$gte: today};
        }

        const event = await this.eventModel.findOne(condition).lean();
        if (!event) throw new NotFoundException('이벤트를 찾을 수 없습니다.');

        return FindEventDetailResponseDto.from(event);
    }

    /**
     * 이벤트 응모자 목록 조회
     * @param query
     */
    async findEventParticipants(query: FindEventParticipantsRequestDto): Promise<FindEventParticipantsResponseDto[]> {
        const match: any = {};

        if (query.eventId) {
            match.eventId = new Types.ObjectId(query.eventId);
        }

        const sortOrder = query.order === 'asc' ? 1 : -1;

        const participants = await this.eventReqModel.aggregate([
            {$match: match},
            {$sort: {joinedAt: sortOrder}},
            {
                $group: {
                    _id: '$userId',
                    doc: {$first: '$$ROOT'},
                },
            },
            {$replaceRoot: {newRoot: '$doc'}},
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {$unwind: '$user'},
        ]);

        return FindEventParticipantsResponseDto.fromList(participants);
    }

    /**
     * 이벤트 당첨자 목록 조회
     * @param query
     */
    async findEventWinners(query: FindEventWinnersRequestDto): Promise<FindEventWinnersResponseDto[]> {
        const condition: any = {};

        if (query.eventId) {
            condition.eventId = new Types.ObjectId(query.eventId);
        }
        if (query.status) {
            condition.status = query.status;
        }

        const winners = await this.eventWinnerModel
            .find(condition)
            .populate('userId', 'email')
            .sort({wonAt: -1})
            .lean();

        return FindEventWinnersResponseDto.fromList(
            winners.map(w => ({...w, user: w.userId}))
        );
    }

    /**
     * 당첨 보상 지급 완료 처리
     * @param eventWinnerIds
     */
    async completeRewards(eventWinnerIds: string[]): Promise<CompleteRewardResponseDto> {
        const session = await this.connection.startSession(); // this.connection = InjectConnection()
        session.startTransaction();

        let updatedCount = 0;

        try {
            for (const id of eventWinnerIds) {
                const winner = await this.eventWinnerModel
                    .findOne({_id: id, status: RewardStatus.WAITING})
                    .lean();

                if (!winner) continue;

                const updateResult = await this.eventWinnerModel.updateOne(
                    {_id: id},
                    {$set: {status: RewardStatus.COMPLETED}},
                );

                if (updateResult.modifiedCount === 0) continue;

                // 보상 인벤토리에 반영
                const update: any = {};
                const {userId, rewardType, rewardValue} = winner;

                if (rewardType === RewardType.POINT) {
                    update.$inc = {point: parseInt(rewardValue, 10)};
                } else if (rewardType === RewardType.COUPON) {
                    update.$push = {coupons: rewardValue};
                } else if (rewardType === RewardType.ITEM) {
                    update.$push = {items: rewardValue};
                }

                await this.inventoryModel.updateOne(
                    {userId},
                    update,
                    {upsert: true},
                );

                updatedCount++;
            }

            return CompleteRewardResponseDto.from(updatedCount);
        } catch (err) {
            await session.abortTransaction();
            throw err;
        } finally {
            await session.endSession();
        }
    }

    /**
     * 보상 취소 처리
     * @param eventWinnerId
     * @param reason
     * @param adminUserId
     */
    async cancelReward(
        eventWinnerId: string,
        reason: string,
        adminUserId: string,
    ): Promise<{ cancelled: boolean }> {
        const session = await this.connection.startSession();
        session.startTransaction();

        try {
            // 이미 지급 되었다면 (COMPLETED) 취소 불가
            // TODO: 추후 지급된 보상을 철회시킬 CS 처리 필요
            const winner = await this.eventWinnerModel.findOne({
                _id: eventWinnerId,
                status: RewardStatus.WAITING,
            }).session(session);

            if (!winner) throw new NotFoundException('취소 가능한 당첨 정보를 찾을 수 없습니다.');

            // 상태를 취소상태(CANCELLED)로 변경
            await this.eventWinnerModel.updateOne(
                {_id: eventWinnerId},
                {$set: {status: RewardStatus.CANCELLED}},
                {session}
            );

            // 보상취소 로그 저장
            await this.rewardCancelLogModel.create([{
                eventWinnerId: winner._id,
                cancelledBy: adminUserId,
                reason,
            }], {session});

            await session.commitTransaction();
            return {cancelled: true};
        } catch (err) {
            await session.abortTransaction();
            throw err;
        } finally {
            await session.endSession();
        }
    }

    /**
     * 이벤트 당첨자 발표 조회
     * @param eventId
     */
    async findEventAnnouncement(eventId: string): Promise<FindEventAnnouncementResponseDto[]> {
        const winners = await this.eventWinnerModel
            .find({ eventId, status: RewardStatus.COMPLETED })
            .populate('userId', 'email')
            .lean();

        const entities = winners.map(w => ({ ...w, user: w.userId }));

        return FindEventAnnouncementResponseDto.fromList(entities);
    }


}
