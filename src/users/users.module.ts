import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { Profile } from 'src/profile/profile.model';
import { ProfileModule } from 'src/profile/profile.module';
import { Role } from 'src/roles/roles.model';
import { RolesModule } from 'src/roles/roles.module';
import { UserRole } from 'src/roles/user-role.model';
import { TokenModule } from 'src/token/token.module';
import { UsersController } from './users.controller';
import { User } from './users.model';
import { UsersService } from './users.service';
import { Token } from 'src/token/token.model';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([User, Role, UserRole, Profile, Token]), // импортируем все модели, которые используем внутри модуля
    // импортируем все модули, с которыми взаимодействуем внутри этого модуля
    forwardRef(() => RolesModule),
    forwardRef(() => AuthModule), // предотвращаем колцевую зависимость
    forwardRef(() => TokenModule),
    forwardRef(() => ProfileModule),
  ],
  exports: [
    UsersService,
  ]
})
export class UsersModule { }
