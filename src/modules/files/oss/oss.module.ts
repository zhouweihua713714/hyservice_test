import { Files } from '@/entities/Files.entity';
import { AuthModule } from '@/modules/auth/auth.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesDao } from '../files.dao';
import { OSSService } from './oss.service';

@Module({
  imports: [TypeOrmModule.forFeature([Files]), AuthModule],
  providers: [OSSService, FilesDao],
  exports: [TypeOrmModule, OSSService, FilesDao],
})
export class OSSModule {}
