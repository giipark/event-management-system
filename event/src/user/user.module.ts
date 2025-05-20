import {Module} from '@nestjs/common';
import {UserService} from './user.service';
import {UserController} from "./user.controller";
import {MongooseModule} from "@nestjs/mongoose";
import {Event, EventSchema} from "../event/schema/event.schema";
import {EventRequest, EventRequestSchema} from "../event/schema/event-req.schema";
import {Inventory, InventorySchema} from "./schema/inventory.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Inventory.name, schema: InventorySchema},
            {name: EventRequest.name, schema: EventRequestSchema},
            {name: Event.name, schema: EventSchema},
        ]),
    ],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule {
}
