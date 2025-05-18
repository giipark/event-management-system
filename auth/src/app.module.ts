import {Module} from '@nestjs/common';
import {AuthModule} from './auth/auth.module';
import {MongooseModule} from "@nestjs/mongoose";
import {ConfigModule} from "@nestjs/config";


@Module({
    imports: [
        AuthModule,
        MongooseModule.forRoot('mongodb://localhost:27017/auth'),
        ConfigModule.forRoot({
            isGlobal: true,
        }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
}
