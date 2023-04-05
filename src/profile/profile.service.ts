import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile } from './profile.model';

@Injectable()
export class ProfileService {
    constructor(@InjectModel(Profile) private profileRepository: typeof Profile, private authService: AuthService) { }

    async registration(userDto: CreateUserDto) {
        const { user, token } = await this.authService.registration(userDto); // регистрируем
        const profileDto = new CreateProfileDto({ ...userDto, userId: user.id });
        const userProfile = await this.profileRepository.create(profileDto); // добавляем профиль пользователя
        return { userProfile, token };
    }
}
