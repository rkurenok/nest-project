import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './roles.model';
import { User } from 'src/users/users.model';
import * as bcrypt from 'bcryptjs';
import { Profile } from 'src/profile/profile.model';
import { CreateProfileDto } from 'src/profile/dto/create-profile.dto';

@Injectable()
export class RolesService implements OnModuleInit {
    constructor(@InjectModel(Role) private roleRepository: typeof Role, @InjectModel(User) private userRepository: typeof User,
        @InjectModel(Profile) private profileRepository: typeof Profile) { }

    async onModuleInit(): Promise<void> {
        const adminRole = await this.getRoleByValue('admin');
        if (!adminRole) { // если нет роли админа - создаем
            await this.createRole({ value: 'admin', description: 'Администратор' });
            await this.createRole({ value: 'user', description: 'Пользователь' });
        }

        let admin = await this.userRepository.findOne({ where: { email: 'admin' } });
        if (!admin) { // если нет пользователя админа - создаем
            admin = await this.userRepository.create({ email: 'admin', password: await bcrypt.hash('adminadmin', 5) }); // добавляем пользователя
            const role = await this.getRoleByValue("admin"); // получаем роль admin
            await admin.$set('roles', [role.id]); // перезаписываем поле roles
            admin.roles = [role];

            const profileDto = new CreateProfileDto({ name: 'admin', surname: 'admin', patronymic: 'admin', phone: 375, userId: admin.id });
            await this.profileRepository.create(profileDto); // добавляем профиль пользователя
        }
    }

    async createRole(dto: CreateRoleDto) {
        const role = await this.roleRepository.create(dto);
        return role;
    }

    async getRoleByValue(value: string) {
        const role = await this.roleRepository.findOne({ where: { value } });
        return role;
    }
}
