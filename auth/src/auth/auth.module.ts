import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "../user/schema/user.schema";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {JwtStrategy} from "./strategies/jwt.strategy";
import {Inventory, InventorySchema} from "../user/schema/inventory.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: User.name, schema: UserSchema},
            {name: Inventory.name, schema: InventorySchema},
        ]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => ({
                secret: config.get('JWT_SECRET'),
                signOptions: {
                    expiresIn: config.get('JWT_EXPIRES_IN'),
                },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy]
})
export class AuthModule {
}
