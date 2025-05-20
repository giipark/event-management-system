import {Module} from '@nestjs/common';
import {UserService} from './user.service';
import {UserController} from "./user.controller";
import {MongooseModule} from "@nestjs/mongoose";
import {Event, EventSchema} from "../event/schema/event.schema";
import {EventRequest, EventRequestSchema} from "../event/schema/event-req.schema";
import {Inventory, InventorySchema} from "./schema/inventory.schema";
import {EventWinner, EventWinnerSchema} from "../event/schema/event-winner.schema";
import {User, UserSchema} from "./schema/user.schema";
import {JwtStrategy} from "../auth/strategies/jwt.strategy";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Inventory.name, schema: InventorySchema},
            {name: Event.name, schema: EventSchema},
            {name: EventRequest.name, schema: EventRequestSchema},
            {name: EventWinner.name, schema: EventWinnerSchema},
            {name: User.name, schema: UserSchema},
        ]),
    ],
    controllers: [UserController],
    providers: [UserService, JwtStrategy],
    exports: [UserService],
})
export class UserModule {
}
