import {Module} from '@nestjs/common';
import {AuthModule} from './auth/auth.module';
import {MongooseModule} from "@nestjs/mongoose";
import {ConfigModule} from "@nestjs/config";


@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forRoot(process.env.MONGO_DB),
        AuthModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
}
