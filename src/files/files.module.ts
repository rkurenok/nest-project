import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Files } from './files.model';
import { TextBlock } from 'src/text-block/text-block.model';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [
    SequelizeModule.forFeature([Files, TextBlock])
  ],
  exports: [FilesService]
})
export class FilesModule { }
