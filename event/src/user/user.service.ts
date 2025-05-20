import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectConnection, InjectModel} from '@nestjs/mongoose';
import {Connection, Model} from 'mongoose';
import {FindMyEventsResponseDto} from './dto/response/find-my-events.response.dto';
import {EventRequest, EventRequestDocument} from "../event/schema/event-req.schema";
import {Event, EventDocument} from "../event/schema/event.schema";
import {FindMyRewardResponseDto} from "./dto/response/find-my-reward.response.dto";
import {EventWinner, EventWinnerDocument} from "../event/schema/event-winner.schema";
import {FindMyInviteCodeResponseDto} from "./dto/response/find-my-invite-code.response.dto";
import {User, UserDocument} from "./schema/user.schema";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(Event.name) private readonly eventModel: Model<EventDocument>,
        @InjectModel(EventRequest.name) private readonly eventReqModel: Model<EventRequestDocument>,
        @InjectModel(EventWinner.name) private readonly eventWinnerModel: Model<EventWinnerDocument>,
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        @InjectConnection() private readonly connection: Connection,
    ) {
    }

    /**
     * 참여한 나의 이벤트 목록 조회
     * @param userId
     */
    async findMyEvents(userId: string): Promise<FindMyEventsResponseDto[]> {
        // 참여한 이벤트 ID 중복제거 조회
        const eventIds = await this.eventReqModel.distinct('eventId', { userId });

        // 해당 이벤트 정보 조회
        const events = await this.eventModel
            .find({ _id: { $in: eventIds } })
            .sort({ startAt: -1 })
            .lean();

        return FindMyEventsResponseDto.fromList(events);
    }

    /**
     * 나의 이벤트 당첨보상 상세조회
     * @param userId
     * @param eventId
     */
    async findMyReward(userId: string, eventId: string): Promise<FindMyRewardResponseDto> {
        // 당첨 여부 조회
        const winner = await this.eventWinnerModel.findOne({
            userId,
            eventId,
        }).lean();

        if (winner) {
            return FindMyRewardResponseDto.from(winner);
        }

        // 응모한 적은 있는지?
        const request = await this.eventReqModel.findOne({
            userId,
            eventId,
        }).lean();

        if (!request) {
            throw new NotFoundException('이벤트에 참여한 기록이 없습니다.');
        }

        // 응모는 했지만 당첨 기록 없음
        // eventId만 반환됨
        return FindMyRewardResponseDto.empty(eventId);
    }

    /**
     * 나의 친구초대 코드 조회
     * @param userId
     */
    async getMyInviteCode(userId: string): Promise<FindMyInviteCodeResponseDto> {
        const user = await this.userModel.findById(userId).lean();
        if (!user || !user.recommendCode) {
            throw new NotFoundException('초대 코드를 찾을 수 없습니다.');
        }
        return FindMyInviteCodeResponseDto.from(user.recommendCode);
    }


}
