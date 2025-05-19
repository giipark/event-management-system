import {Injectable} from '@nestjs/common';
import {InjectConnection, InjectModel} from "@nestjs/mongoose";
import {ClientSession, Connection, Model} from "mongoose";
import {Event, EventDocument} from "./schema/event.schema";
import {EventBenefit, EventBenefitDocument} from "./schema/event-bnef.schema";
import {CreateEventDto} from "./dto/create-event.dto";

@Injectable()
export class EventService {
    constructor(
        @InjectModel(Event.name) private eventModel: Model<EventDocument>,
        @InjectModel(EventBenefit.name) private benefitModel: Model<EventBenefitDocument>,
        @InjectConnection() private readonly connection: Connection,
    ) {
    }

    /**
     * 이벤트 생성
     * @param dto
     * @param id
     */
    async createEvent(dto: CreateEventDto, id: string) {
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
                await this.benefitModel.insertMany(benefits);
            }

            await session.commitTransaction();
            await session.endSession();

            return {eventId: savedEvent._id};
        } catch (err) {
            await session.abortTransaction();
            await session.endSession();
            throw err;
        }
    }
}
