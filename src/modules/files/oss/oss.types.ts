import { ApiProperty } from '@nestjs/swagger';

export class Multipart {
  @ApiProperty({ description: 'id' })
  id: string;

  @ApiProperty({ description: '用户id' })
  'x:user_id': string;

  @ApiProperty({ description: 'key' })
  key: string;

  @ApiProperty({ description: '文件名' })
  filename: string;

  @ApiProperty({ description: 'oss key' })
  OSSAccessKeyId: string;

  @ApiProperty({ description: 'policy base64' })
  policy: string;

  @ApiProperty({ description: '签名' })
  signature: string;

  @ApiProperty({ description: '回调' })
  callback: string;
}

export class OssUploadParams {
  @ApiProperty({ description: '上传域' })
  host: string;

  @ApiProperty({ description: '上传策略' })
  policy: object;

  @ApiProperty({ type: Multipart, description: '其他部分参数' })
  multipart: Multipart;
}

export class LaunchResult {
  @ApiProperty({ type: OssUploadParams, description: 'oss 上传参数' })
  ossUploadParams: OssUploadParams;
}
