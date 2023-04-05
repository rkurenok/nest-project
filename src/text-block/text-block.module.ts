import { Module } from '@nestjs/common';
import { TextBlockController } from './text-block.controller';
import { TextBlockService } from './text-block.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { TextBlock } from './text-block.model';
import { JwtModule } from '@nestjs/jwt';
import { FilesModule } from 'src/files/files.module';
import { Files } from 'src/files/files.model';

@Module({
  controllers: [TextBlockController],
  providers: [TextBlockService],
  imports: [
    SequelizeModule.forFeature([TextBlock, Files]),
    JwtModule,
    FilesModule
  ]
})
export class TextBlockModule { }
