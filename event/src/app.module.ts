import {Module} from '@nestjs/common';
import {EventModule} from './event/event.module';
import {MongooseModule} from "@nestjs/mongoose";
import {ConfigModule} from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forRoot(process.env.MONGO_DB),
        EventModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
}
