import { SetMetadata } from "@nestjs/common/decorators/core/set-metadata.decorator";

export const ROLES_KEY = 'roles'; // по этому ключу получаем мета-данные

export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles); // создаем декоратор, принимающий список ролей для последующего ограничения