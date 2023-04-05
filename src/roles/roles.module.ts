import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/users.model';
import { RolesController } from './roles.controller';
import { Role } from './roles.model';
import { RolesService } from './roles.service';
import { UserRole } from './user-role.model';
import { UsersModule } from 'src/users/users.module';
import { ProfileModule } from 'src/profile/profile.module';
import { Profile } from 'src/profile/profile.model';

@Module({
  controllers: [RolesController],
  providers: [RolesService],
  imports: [
    SequelizeModule.forFeature([Role, User, UserRole, Profile]), // импортируем все модели, которые используем внутри модуля
    forwardRef(() => UsersModule),
    ProfileModule
  ],
  exports: [ // экспортируем все, что будем использовать в других модулях
    RolesService
  ]
})
export class RolesModule { }
