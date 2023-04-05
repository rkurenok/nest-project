import { forwardRef, Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { Token } from './token.model';
import { User } from 'src/users/users.model';

@Module({
  providers: [TokenService],
  controllers: [TokenController],
  imports: [
    SequelizeModule.forFeature([Token, User]), // импортируем все модели, которые используем внутри модуля
    forwardRef(() => UsersModule),
    JwtModule
  ],
  exports: [
    TokenService
  ]
})
export class TokenModule { }
