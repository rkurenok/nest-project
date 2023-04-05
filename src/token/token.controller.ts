import { Controller, Get, Req, Res } from '@nestjs/common';
import { TokenService } from './token.service';
import { Request, Response } from 'express';

@Controller('token')
export class TokenController {
    constructor(private tokenService: TokenService) { }

    @Get('/refresh') // value передается в качестве параметра строки запроса
    async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) { // получаем параметр строки запроса через @Param('value')
        const { refreshToken } = request.cookies; // получаем токен
        const userData = await this.tokenService.refresh(refreshToken); // регистрируемся
        response.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true }); // задаем куки
        return userData;
    }
}
