import _ from 'lodash';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import fetch from 'cross-fetch';
import { ResultData } from '@/common/utils/result';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { signInResInfo } from '@/modules/auth/auth.types';
import { AccessDto, LaunchDto } from './oss.dto';
import { getCallback, getPolicy, getSignature } from '@/common/utils/ossUtils';
import { FilesDao } from '../files.dao';
import { Files } from '@/entities/Files';
import { ErrorCode } from '@/common/utils/errorCode';
import { AuthService } from '@/modules/auth/auth.service';
import { decode } from '@/common/utils';
@Injectable()
export class OSSService {
  constructor(
    private readonly config: ConfigService,
    private readonly filesDao: FilesDao,
    private readonly authService: AuthService
  ) {}

  /**
   * @description 预上传文件, 构造上传参数
   * @param {LaunchDto} params 文件名等信息
   * @param {signInResInfo} user 用户信息
   * @returns {ResultData} 返回ok
   */
  async launch(params: LaunchDto, req: any): Promise<ResultData> {
    // 手动校验是否通过
    let user: Pick<signInResInfo, 'id' | 'status' > | null = null;
    const token: string = req.get('Authorization');
    if (token) {
      // 兼容老token
      const verifyToken = token.startsWith('Bearer ')
        ? token.replace('Bearer ', '')
        : token.replace('bearer ', '');
      const signInResInfo: signInResInfo | null = this.authService.verifyToken(verifyToken);
      if (signInResInfo) {
        user = {
          id: signInResInfo.id,
          status: signInResInfo.status,
        };
      }
    }
    if (!user && req.body.uploadToken) {
      const info = JSON.parse(
        decode(
          req.body.uploadToken,
          this.config.get<string>('encode.secretKey') || '',
          this.config.get<string>('encode.iv') || ''
        )
      );
      user = {
        id: info.id,
        status: info.status,
      };
    }
    if (!user) {
      throw new UnauthorizedException('当前登录已过期, 请重新登录');
    }
    // 构造callback 参数
    const ossBucket = this.config.get<string>('oss.ossBucket');
    const ossRegion = this.config.get<string>('oss.ossRegion');
    const ossKeyId = this.config.get<string>('oss.ossKeyId');
    const host = `http://${ossBucket}.${ossRegion}.aliyuncs.com`;
    const key = uuidv4();
    const callbackBase64 = getCallback().callbackBase64;
    const policy = getPolicy(key, callbackBase64);
    // 插入file表
    await this.filesDao.save({
      id: key,
      filename: params.filename,
    } as unknown as Files);
    // 返回配置信息
    const ossUploadParams = {
      host,
      policy: policy.policyObj,
      multipart: {
        id: key,
        'x:user_id': user.id, // req.user.id,
        key,
        filename: params.filename,
        OSSAccessKeyId: ossKeyId,
        policy: policy.policyBase64,
        signature: policy.policySignature,
        callback: callbackBase64,
      },
    };
    return ResultData.ok({ data: { ossUploadParams } });
  }

  /**
   * @description 预览文件
   * @param {AccessDto} params 文件id 等信息
   * @returns {object} { url: string, statusCode: number }
   */
  async access(params: AccessDto): Promise<{ url: string; statusCode: number }> {
    const { file_id: id } = params; // 下划线是兼容之前的链接
    // 查询文件信息
    const file = await this.filesDao.findOne(id);
    if (_.isEmpty(file) || file?.status === 0) {
      throw new NotFoundException(ErrorCode.FILES.FILE_NOT_FOUND_ERROR);
    }
    // 获取配置数据
    const ossBucket = this.config.get<string>('oss.ossBucket');
    const ossRegion = this.config.get<string>('oss.ossRegion');
    // 签名
    const Signature = getSignature('get', null, '', id, 60);
    const host = `http://${ossBucket}.${ossRegion}.aliyuncs.com/${id}?`;
    const stringUrl = new URLSearchParams();
    stringUrl.append('OSSAccessKeyId', Signature.OSSAccessKeyId);
    stringUrl.append('Expires', String(Signature.Expires));
    stringUrl.append('Signature', Signature.Signature);
    return { url: `${host}${stringUrl.toString()}`, statusCode: 302 };
  }

  /**
   * @description oss 上传回调
   * @param {object} params oss 文件信息
   * @returns {object} req 请求信息
   */
  async callback(params: any, req: any): Promise<Record<string, any>> {
    const { file_id: id } = params;
    // 获取配置数据
    const ossCallbackPath = this.config.get<string>('oss.ossCallbackPath');
    // oss token 校验
    if (process.env.NODE_ENV !== 'production') {
      if (req.headers?.authorization !== 'authorization_test')
        throw new UnauthorizedException(ErrorCode.SYSTEM.OSS_AUTHORIZATION_CHECK_ERROR);
    } else {
      if (!req.headers.authorization) {
        throw new UnauthorizedException(ErrorCode.SYSTEM.OSS_AUTHORIZATION_CHECK_ERROR);
      }
      if (!req.headers['x-oss-pub-key-url']) {
        throw new UnauthorizedException(ErrorCode.SYSTEM.OSS_AUTHORIZATION_CHECK_ERROR);
      }
      try {
        const publicKeyUrl = Buffer.from(
          req.headers['x-oss-pub-key-url'].toString(),
          'base64'
        ).toString();
        if (
          !publicKeyUrl.startsWith('http://gosspublic.alicdn.com/') &&
          !publicKeyUrl.startsWith('https://gosspublic.alicdn.com/')
        ) {
          throw new UnauthorizedException(ErrorCode.SYSTEM.OSS_AUTHORIZATION_CHECK_ERROR);
        }

        const publicKey = await fetch(publicKeyUrl).then((res) => res.text()); // eslint-disable-line
        const authString = `${ossCallbackPath}\n${JSON.stringify(req.body)}`; // eslint-disable-line

        const result = crypto
          .createVerify('RSA-MD5')
          .update(authString)
          .verify(publicKey, req.headers.authorization, 'base64');

        if (!result) {
          throw new UnauthorizedException(ErrorCode.SYSTEM.OSS_AUTHORIZATION_CHECK_ERROR);
        }
      } catch (err) {
        throw new UnauthorizedException(ErrorCode.SYSTEM.OSS_AUTHORIZATION_CHECK_ERROR);
      }
    }
    // 业务操作
    const file = await this.filesDao.findOne(id);
    if (!file) {
      throw new NotFoundException(ErrorCode.FILES.FILE_NOT_FOUND_ERROR);
    }
    file.status = 1;
    file.ossInfo = params;
    // 插入file表
    await this.filesDao.save(file);
    return { ...req.body, status: 1 };
  }
}
