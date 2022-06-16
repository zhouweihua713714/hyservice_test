import {
  Exercise_Types_Enum,
  Upload_Status_Enum,
  User_Status_Enum,
  User_Types_Enum,
} from '@/common/enums/common.enum';
import { ConfigService } from '@nestjs/config';
import { encode, getRedisKey } from '@/common/utils';
import { RedisUtilService } from '@/common/libs/redis/redis.service';
import { RedisKeyPrefix } from '@/common/enums/redisKeyPrefix.enum';

export type CreateUploadTokenOfCacheRetType = {
  uploadTokenKey: string;
  uploadToken: string;
  statusKey: string;
  statusInfo: StatusInfoType;
  finalize: () => void;
};

export type StatusInfoType = {
  status: Upload_Status_Enum;
  answerImages?: [string?];
};

export const createUploadTokenOfCache = async (
  id: string, // user id
  status: User_Status_Enum,
  type: User_Types_Enum,
  questionId: string,
  exerciseType: Exercise_Types_Enum,
  config: ConfigService,
  redisService: RedisUtilService,
  uploadStatus?: Upload_Status_Enum,
  answerImages?: [string?]
): Promise<CreateUploadTokenOfCacheRetType> => {
  const uploadToken = encode(
    JSON.stringify({
      id,
      status,
      type,
      timestamp: Date.now(),
      questionId,
      exerciseType,
    }),
    config.get<string>('encode.secretKey') || '',
    config.get<string>('encode.iv') || ''
  );
  // 构造redis键值
  const key = `${id}:${questionId}:${exerciseType}`;
  const uploadTokenKey = getRedisKey(RedisKeyPrefix.UPLOAD_TOKEN, key);
  // 状态键
  const statusKey = getRedisKey(RedisKeyPrefix.UPLOAD_TOKEN, uploadToken || '');
  const statusInfo: StatusInfoType = {
    status: uploadStatus || Upload_Status_Enum.Waiting,
    answerImages: answerImages || [],
  };
  // 缓存2小时
  await redisService
    .getClient()
    .multi()
    .mset([uploadTokenKey, uploadToken, statusKey, JSON.stringify(statusInfo)])
    .expire(uploadTokenKey, 2 * 60 * 60)
    .expire(statusKey, 2 * 60 * 60)
    .exec();
  return {
    uploadTokenKey,
    uploadToken,
    statusKey,
    statusInfo,
    finalize: async () => {
      await Promise.all([redisService.del(uploadTokenKey), redisService.del(statusKey)]);
    },
  };
};
