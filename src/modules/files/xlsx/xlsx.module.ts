import { Files } from '@/entities/Files.entity';
import { AuthModule } from '@/modules/auth/auth.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesDao } from '../files.dao';
import { XlsxService } from './xlsx.service';

@Module({
  imports: [TypeOrmModule.forFeature([Files]), AuthModule],
  providers: [XlsxService, FilesDao],
  exports: [TypeOrmModule, XlsxService],
})
export class XlsxModule {}
