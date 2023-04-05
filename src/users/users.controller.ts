import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/roles.auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { AddRoleDto } from './dto/add-role.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { Request, Response } from 'express';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) { }

    @Post()
    create(@Body() userDto: CreateUserDto) { // как тело запроса принимаем dto
        return this.userService.createUser(userDto);
    }

    @Get()
    @Roles('admin')
    @UseGuards(RolesGuard)
    getAll() {
        return this.userService.getAllUsers();
    }

    @Post('/role')
    @Roles('admin')
    @UseGuards(RolesGuard)
    addRole(@Body() dto: AddRoleDto) {
        return this.userService.addRole(dto);
    }

    @Post('/update')
    updateUser(@Req() request: Request, @Body() userDto: CreateUserDto) {
        const { refreshToken } = request.cookies; // получаем токен
        return this.userService.updateUser(userDto, refreshToken);
    }

    @Put('/update/:id')
    @Roles('admin')
    @UseGuards(RolesGuard)
    updateUserByAdmin(@Body() userDto: CreateUserDto, @Param('id') id: number) {
        return this.userService.updateUserByAdmin(userDto, id);
    }

    @Delete('/delete')
    deleteUser(@Req() request: Request, @Res({ passthrough: true }) response: Response) { 
        const { refreshToken } = request.cookies; // получаем токен
        response.clearCookie('refreshToken'); // удаляем токен в куках
        return this.userService.deleteUser(refreshToken);
    }

    @Delete('/delete/:id')
    @Roles('admin')
    @UseGuards(RolesGuard)
    deleteUserByAdmin(@Param('id') id: number) {
        return this.userService.deleteUserByAdmin(id);
    }
}
