import {Module} from '@nestjs/common';
import {EventController} from './event.controller';
import {EventService} from './event.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Event, EventSchema} from "./schema/event.schema";
import {EventBenefit, EventBenefitSchema} from "./schema/event-bnef.schema";
import {EventRequest, EventRequestSchema} from "./schema/event-req.schema";
import {EventWinner, EventWinnerSchema} from "./schema/event-winner.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Event.name, schema: EventSchema},
            {name: EventBenefit.name, schema: EventBenefitSchema},
            {name: EventRequest.name, schema: EventRequestSchema},
            {name: EventWinner.name, schema: EventWinnerSchema},
        ]),
    ],
    controllers: [EventController],
    providers: [EventService]
})
export class EventModule {
}
