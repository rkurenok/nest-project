import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest(); // получаем request запроса
        try {
            const authHeader = req.headers.authorization; // получаем authorization header
            const bearer = authHeader.split(' ')[0]; // тип authorization заголовка (bearer)
            const token = authHeader.split(' ')[1]; // токен authorization заголовка

            if (bearer !== 'Bearer' || !token) { // если не тот заголовок
                throw new UnauthorizedException({ message: 'Пользователь не авторизован' });
            }

            const user = this.jwtService.verify(token); // получаем закодированные данные из токена
            req.user = user;
            return true;
        } catch (e) {
            throw new UnauthorizedException({ message: 'Пользователь не авторизован' });
        }
    }
}