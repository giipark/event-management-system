import {BadRequestException, ConflictException, Injectable, NotFoundException} from '@nestjs/common';
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
import {FindEndedEventsResponseDto} from "./dto/response/find-ended-events.response.dto";
import {User, UserDocument} from "../user/schema/user.schema";
import {getRewardUpdate} from "../common/utils/util";
import {EventType} from "./schema/const/event-type.enum";

@Injectable()
export class EventService {
    constructor(
        @InjectModel(Event.name) private eventModel: Model<EventDocument>,
        @InjectModel(EventBenefit.name) private eventBenefitModel: Model<EventBenefitDocument>,
        @InjectModel(EventRequest.name) private eventReqModel: Model<EventRequestDocument>,
        @InjectModel(EventWinner.name) private eventWinnerModel: Model<EventWinnerDocument>,
        @InjectModel(Inventory.name) private inventoryModel: Model<InventoryDocument>,
        @InjectModel(RewardCancelLog.name) private rewardCancelLogModel: Model<RewardCancelLogDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
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
            .find({eventId, status: RewardStatus.COMPLETED})
            .populate('userId', 'email')
            .lean();

        const entities = winners.map(w => ({...w, user: w.userId}));

        return FindEventAnnouncementResponseDto.fromList(entities);
    }

    /**
     * 종료된 이벤트 목록 조회
     * @param role
     */
    async findEndedEvents(role: RoleType): Promise<FindEndedEventsResponseDto[]> {
        const condition: any = {isEnded: true};

        if (role === RoleType.USER) {
            condition.status = EventStatus.ACTIVE;
        }

        const events = await this.eventModel
            .find(condition)
            .sort({startAt: -1})
            .lean();

        return FindEndedEventsResponseDto.fromList(events);
    }

    /**
     * 이벤트 친구초대형 초대코드 등록
     * @param userId
     * @param eventId
     * @param usedInviteCode
     */
    async registerInviteCode(userId: string, eventId: string, usedInviteCode: string): Promise<{ success: boolean }> {
        const session: ClientSession = await this.connection.startSession();
        session.startTransaction();

        try {
            // 이벤트 정보 조회
            const event = await this.eventModel.findById(eventId).lean();
            if (!event || event.type !== EventType.INVITE) {
                throw new BadRequestException('친구초대 이벤트가 아닙니다.')
            }

            // 나의 코드 조회 (자기 자신 코드 방지용)
            const user = await this.userModel.findById(userId).lean();
            if (!user?.recommendCode) throw new BadRequestException('유저 초대 코드가 존재하지 않습니다.');

            // 자기 자신의 코드 사용 금지
            if (user.recommendCode === usedInviteCode) {
                throw new BadRequestException('자기 자신의 초대코드는 사용할 수 없습니다.');
            }

            // 이미 참여했는지 체크
            const hasInvitedBefore = await this.eventReqModel.exists({
                userId,
                usedInviteCode: {$ne: null},
            });
            if (hasInvitedBefore) {
                throw new ConflictException('이미 친구초대형 이벤트에 참여하셨습니다.');
            }

            // 초대코드가 유효한 코드인지 체크
            const inviter = await this.userModel.findOne({recommendCode: usedInviteCode}).lean();
            if (!inviter) {
                throw new BadRequestException('유효하지 않은 초대 코드입니다.');
            }

            // 내가 가진 초대코드를 inviter가 사용한 적 있는지 체크
            const mutal = await this.eventReqModel.exists({
                userId: inviter._id,
                usedInviteCode: user.recommendCode, // 내 코드
            });
            if (mutal) {
                throw new ConflictException('상호간의 초대는 허용되지 않습니다.');
            }

            await this.eventReqModel.create({
                userId,
                eventId,
                usedInviteCode,
                joinedAt: new Date(),
            });

            // 보상 정보 조회
            const benefit = await this.eventBenefitModel.findOne({eventId}).lean();
            if (!benefit) throw new NotFoundException('이벤트 보상 정보가 없습니다.');

            const {rewardType, rewardValue} = benefit;

            // 보상 지급
            await this.inventoryModel.updateOne(
                {userId}, // 자기 자신
                getRewardUpdate(rewardType, rewardValue),
                {upsert: true, session}
            );

            await this.inventoryModel.updateOne(
                {userId: inviter._id}, // 초대한 사람
                getRewardUpdate(rewardType, rewardValue),
                {upsert: true, session}
            );

            return {success: true};
        } catch (err) {
            await session.abortTransaction();
            throw err;
        } finally {
            await session.endSession();
        }
    }

    /**
     * 안내형 이벤트 보상 요청 등록
     * @param userId
     * @param eventId
     */
    async requestAlertReward(userId: string, eventId: string): Promise<{ success: boolean }> {
        const session: ClientSession = await this.connection.startSession();
        session.startTransaction();

        try {
            const event = await this.eventModel.findById(eventId).lean();
            if (!event) throw new NotFoundException('이벤트를 찾을 수 없습니다.');

            // 이벤트 유형 체크
            if (event.type !== EventType.ANNOUNCE) {
                throw new BadRequestException('안내형 이벤트가 아닙니다.');
            }

            // 중복 요청 방지
            const exists = await this.eventReqModel.exists({userId, eventId});
            if (exists) {
                throw new ConflictException('이미 보상을 요청하셨습니다.');
            }

            // 보상 정보 조회
            const benefit = await this.eventBenefitModel.findOne({eventId}).lean();
            if (!benefit) throw new NotFoundException('보상 정보가 없습니다.');

            const eventReq = await this.eventReqModel.create({
                userId,
                eventId,
                joinedAt: new Date(),
            });

            await this.eventWinnerModel.create({
                userId,
                eventId,
                eventReqId: eventReq._id, // 위에서 생성된 참여 ID
                rewardType: benefit.rewardType,
                rewardValue: benefit.rewardValue,
                status: RewardStatus.COMPLETED,
                wonAt: new Date(),
            });

            // 보상 지급
            await this.inventoryModel.updateOne(
                {userId},
                getRewardUpdate(benefit.rewardType, benefit.rewardValue),
                {upsert: true, session}
            );

            return {success: true};
        } catch (err) {
            await session.abortTransaction();
            throw err;
        } finally {
            await session.endSession();
        }
    }

}
