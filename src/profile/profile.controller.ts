import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
    constructor(private profileService: ProfileService) { }

    @Post('/registration')
    async registration(@Body() userDto: CreateUserDto, @Res({ passthrough: true }) response: Response) {
        const { userProfile, token } = await this.profileService.registration(userDto); // регистрируемся
        response.cookie('refreshToken', token.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true }); // задаем куки
        return { userProfile, token };
    }
}
