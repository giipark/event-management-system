import {Module} from '@nestjs/common';
import {EventModule} from './event/event.module';
import {MongooseModule} from "@nestjs/mongoose";
import {ConfigModule} from "@nestjs/config";
import {UserController} from './user/user.controller';
import {UserModule} from './user/user.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forRoot(process.env.MONGO_DB),
        EventModule,
        UserModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
}
