import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { TextBlockService } from './text-block.service';
import { CreateTextBlockDto } from './dto/create-text-block.dto';
import { Roles } from 'src/auth/roles.auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('textBlock')
export class TextBlockController {
    constructor(private textBlockService: TextBlockService) { }

    @Post()
    @UseInterceptors(FileInterceptor('image')) // для работы с файлами
    @Roles('admin')
    @UseGuards(RolesGuard)
    create(@Body() textBlockDto: CreateTextBlockDto, @UploadedFile() image) {
        return this.textBlockService.create(textBlockDto, image);
    }

    @Get()
    getAll() {
        console.log('getAll');
        return this.textBlockService.getAll();
    }

    @Get('/filter?')
    getByGroup(@Query('group') group: string) {
        return this.textBlockService.getByGroup(group ?? null, true);
    }

    @Get('/:name')
    getByName(@Param('name') name: string) {
        return this.textBlockService.getByName(name, true);
    }

    @Put('/update/:name')
    @UseInterceptors(FileInterceptor('image')) // для работы с файлами
    @Roles('admin')
    @UseGuards(RolesGuard)
    update(@Body() textBlockDto: CreateTextBlockDto, @UploadedFile() image, @Param('name') name: string) {
        return this.textBlockService.update(textBlockDto, name, image);
    }

    @Delete('/delete/:name')
    @Roles('admin')
    @UseGuards(RolesGuard)
    delete(@Param('name') name: string) {
        return this.textBlockService.delete(name);
    }
}
