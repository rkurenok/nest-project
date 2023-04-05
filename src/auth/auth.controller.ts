import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('/login')
    async login(@Body() userDto: CreateUserDto, @Res({ passthrough: true }) response: Response) {
        const userData = await this.authService.login(userDto);
        response.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true }); // задаем куки
        return userData;
    }

    @Get('/logout')
    logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
        const { refreshToken } = request.cookies; // получаем токен
        const token = this.authService.logout(refreshToken); // удаляем токен в бд
        response.clearCookie('refreshToken'); // удаляем токен в куках
        return token;
    }
}
