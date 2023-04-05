import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { ROLES_KEY } from "./roles.auth.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private jwtService: JwtService, private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [ // Достаем данные с помощью рефлектора
                context.getHandler(),
                context.getClass(),
            ]);
            if (!requiredRoles) { // если ролей нет
                return true;
            }
            const req = context.switchToHttp().getRequest(); // получаем request запроса
            const authHeader = req.headers.authorization; // получаем authorization header
            const bearer = authHeader.split(' ')[0]; // тип заголовка (bearer)
            const token = authHeader.split(' ')[1]; // токен заголовка
            if (bearer !== 'Bearer' || !token) { // если не тот заголовок
                console.log(bearer);
                throw new UnauthorizedException({ message: 'Пользователь не авторизован' });
            }
            const user = this.jwtService.verify(token, { secret: process.env.JWT_REFRESH_SECRET }); // получаем закодированные данные из токена
            req.user = user;
            return user.roles.some(role => requiredRoles.includes(role.value)); // проверяем, есть ли у пользователя роль, необходимая для доступа к эндпоинту
        } catch (e) {
            throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN);
        }
    }
}