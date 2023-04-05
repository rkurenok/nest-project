import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { TokenModule } from 'src/token/token.module';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
    forwardRef(() => UsersModule), // предотвращаем колцевую зависимость
    // регистрируем jwt модуль внутри auth модуля
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET', // секретный ключ
      signOptions: {
        expiresIn: '24h' // время жизни токена
      }
    }),
    TokenModule
  ],
  exports: [
    AuthService,
    JwtModule
  ]
})
export class AuthModule { }
