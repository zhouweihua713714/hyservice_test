import _ from 'lodash';
import { Injectable,  } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisUtilService } from '@/common/libs/redis/redis.service';

@Injectable()
export class FilesService {
  constructor(
    // private readonly questionsRepository: QuestionsDao,
    private readonly config: ConfigService,
    private readonly redisService: RedisUtilService
  ) {}

}
