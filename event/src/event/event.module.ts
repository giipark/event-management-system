import {Module} from '@nestjs/common';
import {EventController} from './event.controller';
import {EventService} from './event.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Event, EventSchema} from "./schema/event.schema";
import {EventBenefit, EventBenefitSchema} from "./schema/event-bnef.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Event.name, schema: EventSchema},
            {name: EventBenefit.name, schema: EventBenefitSchema},
        ]),
    ],
    controllers: [EventController],
    providers: [EventService]
})
export class EventModule {
}
