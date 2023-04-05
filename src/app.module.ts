import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./users/users.model";
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { Role } from "./roles/roles.model";
import { UserRole } from "./roles/user-role.model";
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';
import { Token } from "./token/token.model";
import { ProfileModule } from './profile/profile.module';
import { Profile } from "./profile/profile.model";
import { TextBlockModule } from './text-block/text-block.module';
import { FilesModule } from './files/files.module';
import { TextBlock } from "./text-block/text-block.model";
import { Files } from "./files/files.model";
import { ServeStaticModule } from "@nestjs/serve-static";
import * as path from "path";

@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env'
        }),
        // ServeStaticModule.forRoot({ // для раздачи статики с сервера
        //     rootPath: path.resolve(__dirname, 'static'),
        // }),
        SequelizeModule.forRoot({ // конфигурация бд
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT), // порт должен быть числовым значением
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            models: [User, Role, UserRole, Token, Profile, TextBlock, Files], // модели данных (таблицы)
            autoLoadModels: true // создание таблиц на основании моделей
        }),
        UsersModule,
        RolesModule,
        AuthModule,
        TokenModule,
        ProfileModule,
        TextBlockModule,
        FilesModule
    ]
})
export class AppModule {

}