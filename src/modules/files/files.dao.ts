import { Files } from '@/entities/Files.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FilesDao {
  constructor(
    @InjectRepository(Files)
    private filesRepository: Repository<Files>
  ) {}

  // 保存文件
  async save(file: Files): Promise<Files> {
    return this.filesRepository.save(file);
  }

  // 根据id 查询文件
  async findOne(id: string): Promise<Files | null> {
    return this.filesRepository.findOneBy({ id });
  }
}
