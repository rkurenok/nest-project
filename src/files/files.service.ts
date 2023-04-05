import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Files } from './files.model';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';
import { Op } from 'sequelize';

@Injectable()
export class FilesService {
    constructor(@InjectModel(Files) private filesRepository: typeof Files) { }

    async createFile(file, essenceTable, essenceId) {
        try {
            const fileName = uuid.v4() + path.extname(file.originalname); // генерируем название файла + расширение из старого названия
            const addFile = await this.filesRepository.create({ name: fileName, essenceTable, essenceId }); // добавляем файл в репозиторий
            const filePath = path.resolve(__dirname, '..', 'static');
            if (!fs.existsSync(filePath)) { // создаем папку
                fs.mkdirSync(filePath, { recursive: true });
            }
            fs.writeFileSync(path.join(filePath, fileName), file.buffer); // записываем файл в папку
            return addFile;
        } catch (e) {
            throw new HttpException('Произошла ошибка при записи файла', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteUnusedFiles() {
        const unusedFiles = await this.filesRepository.findAll({ where: { essenceTable: null, essenceId: null, updatedAt: { [Op.lt]: new Date(Date.now() - 60 * 60 * 1000) } } });
        await this.filesRepository.destroy({ where: { essenceTable: null, essenceId: null, updatedAt: { [Op.lt]: new Date(Date.now() - 60 * 60 * 1000) } } });
        return unusedFiles;
    }

    async updateFile(file, essenceTable, essenceId) {
        try {
            const fileName = uuid.v4() + path.extname(file.originalname); // генерируем название файла + расширение из старого названия
            const oldFile = await this.filesRepository.findOne({ where: { essenceTable, essenceId } });
            const oldFileName = oldFile.name;
            const newFile = await oldFile.update({ name: fileName }); // обновляем запись файла в репозитории

            const filePath = path.resolve(__dirname, '..', 'static');
            fs.unlinkSync(path.join(filePath, oldFileName)); // удаляем старый файл
            fs.writeFileSync(path.join(filePath, fileName), file.buffer); // добавлям новый файл
            return newFile;
        } catch (e) {
            throw new HttpException('Произошла ошибка при записи файла', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getFile(essenceTable, essenceId) {
        return this.filesRepository.findOne({ where: { essenceTable, essenceId } });
    }
}
