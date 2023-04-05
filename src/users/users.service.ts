import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Profile } from 'src/profile/profile.model';
import { RolesService } from 'src/roles/roles.service';
import { TokenService } from 'src/token/token.service';
import { AddRoleDto } from './dto/add-role.dto';
import { CredentialsUserDto } from './dto/creadentials-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';
import * as bcrypt from 'bcryptjs';
import { Token } from 'src/token/token.model';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private userRepository: typeof User,
        @InjectModel(Profile) private profileRepository: typeof Profile,
        @InjectModel(Token) private tokenRepository: typeof Token, // инджектим модель для работы с репозиторием
        private roleService: RolesService, private tokenService: TokenService) { } // инжектим сторонний сервис

    async createUser(dto: CredentialsUserDto) {
        const user = await this.userRepository.create(dto); // добавляем пользователя
        const role = await this.roleService.getRoleByValue("user"); // получаем роль user
        await user.$set('roles', [role.id]); // перезаписываем поле roles
        user.roles = [role];
        return user;
    }

    async getAllUsers() {
        const users = await this.userRepository.findAll({ include: { all: true } }); // получаем всех пользователей (и все поля, с которыми связан каждый пользователь)
        return users;
    }

    // функция для проверки мэила во время регистрации/логина
    async getUsersByEmail(email: string) {
        const user = await this.userRepository.findOne({ where: { email }, include: { all: true } });
        return user;
    }

    async addRole(dto: AddRoleDto) {
        const user = await this.userRepository.findByPk(dto.userId); // получаем пользователя по id
        const role = await this.roleService.getRoleByValue(dto.value); // получаем роль
        if (role && user) { // если пользователь и роль существуют
            await user.$add('role', role.id); // добавляем роль пользователю
            return dto;
        }
        throw new HttpException('Пользователь или роль не найдены', HttpStatus.NOT_FOUND);
    }

    async updateUser(userDto: CreateUserDto, token: string) {
        const userData = this.tokenService.validateRefreshToken(token);
        if (!userData) {
            throw new UnauthorizedException({ message: 'Пользователь не аворизован' });
        }

        const findUser = await this.userRepository.findOne({ where: { email: userDto.email } });
        if (findUser) {
            throw new HttpException('Данный емаил уже существует', HttpStatus.CONFLICT);
        }

        // обновляем таблицу user
        let user = await this.userRepository.findByPk(userData.id);
        const hashPassword = await bcrypt.hash(user.password, 5); // хешируем пароль + соль
        await user.update({ ...userDto, password: hashPassword });
        user = await this.userRepository.findByPk(userData.id); // получаем обновленного пользователя

        // обновляем таблицу profile
        let userProfile = await this.profileRepository.findOne({ where: { userId: userData.id } });
        await userProfile.update({ ...userDto });
        userProfile = await this.profileRepository.findOne({ where: { userId: userData.id } }); // получаем обновленный профиль пользователя

        return { user, userProfile };
    }

    async updateUserByAdmin(userDto: CreateUserDto, id: number) {
        // получаем пользователя
        let user = await this.userRepository.findByPk(id);
        if (!user) {
            throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
        }

        const findUser = await this.userRepository.findOne({ where: { email: userDto.email } });
        if (findUser) {
            throw new HttpException('Данный емаил уже существует', HttpStatus.CONFLICT);
        }

        // обновляем таблицу user
        const hashPassword = await bcrypt.hash(user.password, 5); // хешируем пароль + соль
        await user.update({ ...userDto, password: hashPassword });
        user = await this.userRepository.findByPk(user.id); // получаем обновленного пользователя

        // обновляем таблицу profile
        let userProfile = await this.profileRepository.findOne({ where: { userId: user.id } });
        await userProfile.update({ ...userDto });
        userProfile = await this.profileRepository.findOne({ where: { userId: user.id } }); // получаем обновленный профиль пользователя

        return { user, userProfile };
    }

    async deleteUser(token: string) {
        const userData = this.tokenService.validateRefreshToken(token);
        if (!userData) {
            throw new UnauthorizedException({ message: 'Пользователь не авторизован' });
        }

        // обновляем таблицу profile
        await this.profileRepository.destroy({ where: { userId: userData.id } });

        await this.tokenService.removeToken(token); // удаляем токен в бд

        // обновляем таблицу user
        await this.userRepository.destroy({ where: { id: userData.id } });

        return "User was deleted";
    }

    async deleteUserByAdmin(id: number) {
        // получаем пользователя
        let user = await this.userRepository.findByPk(id);
        if (!user) {
            throw new UnauthorizedException({ message: 'Неверный id пользователя' });
        }

        // обновляем таблицу profile
        await this.profileRepository.destroy({ where: { userId: id } });

        const token = await this.tokenRepository.findOne({ where: { userId: id } });
        const refreshToken = token.refreshToken;
        await this.tokenService.removeToken(refreshToken); // удаляем токен в бд

        // обновляем таблицу user
        await this.userRepository.destroy({ where: { id } });

        return "User was deleted";
    }
}
