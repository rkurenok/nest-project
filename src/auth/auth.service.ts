import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { TokenService } from 'src/token/token.service';
import { CredentialsUserDto } from 'src/users/dto/creadentials-user.dto';

@Injectable()
export class AuthService {
    constructor(private userService: UsersService, private jwtService: JwtService, private tokenService: TokenService) { }

    async login(userDto: CredentialsUserDto) {
        const user = await this.validateUser(userDto); // валидируем токен
        return this.tokenService.createToken(user);  // создаем токен
    }

    async registration(userDto: CreateUserDto) {
        const candidate = await this.userService.getUsersByEmail(userDto.email); // проверяем емэил пользователя
        if (candidate) { // если email уже занят
            throw new HttpException('Пользователь с таким email уже существует', HttpStatus.BAD_REQUEST); // 400 status
        }
        const hashPassword = await bcrypt.hash(userDto.password, 5); // хешируем пароль + соль
        const user = await this.userService.createUser({ ...userDto, password: hashPassword }); // создаем пользователя (разворачиваем dto, но перезаписываем пароль)

        const token = await this.tokenService.createToken(user); // создаем токен
        return { user, token };
    }

    private async validateUser(userDto: CredentialsUserDto) {
        const user = await this.userService.getUsersByEmail(userDto.email); // проверяем емэил пользователя
        const passwordEquals = await bcrypt.compare(userDto.password, user.password); // сравниваем пароли
        if (user && passwordEquals) { // если пользователь был найден и пароли совпадают
            return user;
        }
        throw new UnauthorizedException({ message: 'Некорректный емайл или пароль' });
    }

    async logout(refreshToken) {
        const token = await this.tokenService.removeToken(refreshToken);
        return token;
    }
}
