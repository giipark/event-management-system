import {Injectable} from '@nestjs/common';
import {InjectConnection, InjectModel} from '@nestjs/mongoose';
import {Connection, Model} from 'mongoose';
import {FindMyEventsResponseDto} from './dto/response/find-my-events.response.dto';
import {EventRequest, EventRequestDocument} from "../event/schema/event-req.schema";
import {Event, EventDocument} from "../event/schema/event.schema";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(Event.name) private readonly eventModel: Model<EventDocument>,
        @InjectModel(EventRequest.name) private readonly eventReqModel: Model<EventRequestDocument>,
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
}
