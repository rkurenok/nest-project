import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
    constructor(private roleService: RolesService) { }

    @Post()
    createRole(@Body() dto: CreateRoleDto) {
        return this.roleService.createRole(dto); // создаем роль
    }

    @Get('/:value') // value передается в качестве параметра строки запроса
    getRoleByValue(@Param('value') value: string) { // получаем параметр строки запроса через @Param('value')
        return this.roleService.getRoleByValue(value);
    }
}
