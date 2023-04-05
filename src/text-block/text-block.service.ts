import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTextBlockDto } from './dto/create-text-block.dto';
import { InjectModel } from '@nestjs/sequelize';
import { TextBlock } from './text-block.model';
import { FilesService } from 'src/files/files.service';
import { Files } from 'src/files/files.model';

@Injectable()
export class TextBlockService {
    constructor(@InjectModel(TextBlock) private textBlockRepository: typeof TextBlock, @InjectModel(Files) private filesRepository: typeof Files,
        private filesService: FilesService) { }

    async create(textBlockDto: CreateTextBlockDto, image: File) {
        let textBlock = await this.textBlockRepository.findOne({ where: { name: textBlockDto.name } });
        if (textBlock) {
            throw new HttpException('Блок с таким именем уже существует', HttpStatus.CONFLICT);
        }

        textBlock = await this.textBlockRepository.create(textBlockDto); // создаем блок

        // сохраняем файл
        const tableName = this.textBlockRepository.tableName;
        const textBlockId = textBlock.id;
        const file = await this.filesService.createFile(image, tableName, textBlockId); // сохраняем файл

        return { textBlock, file };
    }

    async getAll() {
        let textBlocks = await this.textBlockRepository.findAll();
        textBlocks = await this.addImagesForResult(textBlocks); // добавляем картинки к результату
        return textBlocks;
    }

    async getByName(name: string, withImage: boolean) {
        let textBlock = await this.textBlockRepository.findOne({ where: { name } });
        if (withImage) {
            textBlock = await this.addImageForResult(textBlock); // добавляем картинкeу к результату
        }
        return textBlock;
    }

    async getByGroup(group: string, withImage: boolean) {
        let textBlocks = await this.textBlockRepository.findAll({ where: { group } });
        if (withImage) {
            textBlocks = await this.addImagesForResult(textBlocks); // добавляем картинки к результату
        }
        return textBlocks;
    }

    async update(textBlockDto: CreateTextBlockDto, name: string, image: File) {
        let textBlock = await this.getByName(name, false);
        if (!textBlock) {
            throw new HttpException('Блок не найден', HttpStatus.NOT_FOUND);
        }

        const findTextBlock = await this.getByName(textBlockDto.name, false);
        if (findTextBlock && findTextBlock.id !== textBlock.id) {
            throw new HttpException('Блок с таким именем уже существует', HttpStatus.CONFLICT);
        }

        // обновляем таблицу
        await textBlock.update({ ...textBlockDto });

        if (image) { // если пришла картинка для обновления - обновляем ее
            const tableName = this.textBlockRepository.tableName;
            const textBlockId = textBlock.id;
            await this.filesService.updateFile(image, tableName, textBlockId);
        }

        textBlock = await this.getByName(textBlock.name, true); // прикрепляем картинку к результату

        return textBlock;
    }

    async delete(name: string) {
        const textBlock = await this.getByName(name, false);
        if (!textBlock) {
            throw new HttpException('Блок не найден', HttpStatus.NOT_FOUND);
        }

        // обнуляем данные картинки в бд
        const tableName = this.textBlockRepository.tableName;
        const textBlockId = textBlock.id;
        const image = await this.filesService.getFile(tableName, textBlockId);
        image.update({essenceTable: null, essenceId: null});

        // удаляем блок
        await this.textBlockRepository.destroy({ where: { name } });

        return "Text block was deleted";
    }

    private async addImageForResult(textBlocks: TextBlock) {
        textBlocks = textBlocks.dataValues;
        const tableName = this.textBlockRepository.tableName;
        const image = await this.filesRepository.findOne({ where: { essenceTable: tableName, essenceId: textBlocks.id } }); // выбираем файлы, относящиеся к данной таблице
        textBlocks = Object.assign(textBlocks, { image });
        return textBlocks;
    }

    private async addImagesForResult(textBlocks: TextBlock[]) {
        textBlocks = textBlocks.map(e => e.dataValues); // оставляем необходимый набор данных
        const tableName = this.textBlockRepository.tableName;
        const images = await this.filesRepository.findAll({ where: { essenceTable: tableName } }); // выбираем файлы, относящиеся к данной таблице
        for (let i = 0; i < textBlocks.length; i++) {
            textBlocks[i] = Object.assign(textBlocks[i], { image: images[i] }); // добавляем свойство с соответствующей картинкой к каждому объекту 
        }

        return textBlocks;
    }
}
