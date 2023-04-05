import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/users/users.model';
import { UsersModule } from 'src/users/users.module';
import { ProfileController } from './profile.controller';
import { Profile } from './profile.model';
import { ProfileService } from './profile.service';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  imports: [
    SequelizeModule.forFeature([Profile, User]), // импортируем все модели, которые используем внутри модуля
    // импортируем все модули, с которыми взаимодействуем внутри этого модуля
    forwardRef(() => UsersModule),
    AuthModule
  ],
  exports: [
    ProfileService,
  ]
})
export class ProfileModule { }
