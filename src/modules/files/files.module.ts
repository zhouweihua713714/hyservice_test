import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { OSSModule } from './oss/oss.module';
import { XlsxModule } from './xlsx/xlsx.module';

@Module({
  imports: [OSSModule,XlsxModule],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
