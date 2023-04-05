import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/users/users.model';
import { AddTokenDto } from './dto/add-token.dto';
import { CreatePayloadDto } from './dto/create-payload.dto';
import { Token } from './token.model';

@Injectable()
export class TokenService {
    constructor(private jwtService: JwtService, @InjectModel(Token) private tokenRepository: typeof Token, @InjectModel(User) private userRepository: typeof User) { }

    async refresh(refreshToken: string) {
        if (!refreshToken) {
            throw new UnauthorizedException({ message: 'Пользователь не аворизован' });
        }
        const userData = this.validateRefreshToken(refreshToken);
        const tokenFromDb = await this.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw new UnauthorizedException({ message: 'Пользователь не аворизован' });
        }

        const user = await this.userRepository.findByPk(userData.id);

        return this.createToken(user); // создаем токен
    }

    generateToken(payload: CreatePayloadDto) {
        const accessToken = this.jwtService.sign(payload, { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '30m' });
        const refreshToken = this.jwtService.sign(payload, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '30d' });
        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId: number, refreshToken: string) {
        const tokenData = await this.tokenRepository.findOne({ where: { userId } });
        if (tokenData) { // если токен найден
            tokenData.refreshToken = refreshToken; // перезаписываем его 
            return tokenData.save();
        }
        // если запись с токеном не найдена - значит логинимся впервые -> создаем новый токен для него
        const token = await this.tokenRepository.create({ refreshToken, userId });
        return token;
    }

    async removeToken(refreshToken: string) {
        await this.tokenRepository.destroy({ where: { refreshToken } });
        return refreshToken;
    }

    validateAccessToken(token: string) {
        try {
            const userData = this.jwtService.verify(token, { secret: process.env.JWT_ACCESS_SECRET });
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token: string) {
        try {
            const userData = this.jwtService.verify(token, { secret: process.env.JWT_REFRESH_SECRET });
            return userData;
        } catch (e) {
            return null;
        }
    }

    async findToken(refreshToken: string) {
        const tokenData = await this.tokenRepository.findOne({ where: { refreshToken } });
        return tokenData;
    }

    async createToken(user) {
        const payload = new CreatePayloadDto(user); // создаем объект с данными для записи в токен
        const tokens = this.generateToken({ email: payload.email, id: payload.id, roles: payload.roles });
        await this.saveToken(user.id, tokens.refreshToken); // сохраняем refresh токен в базу данных
        return { ...tokens, user };
    }
}
