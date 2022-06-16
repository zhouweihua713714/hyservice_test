import { ApiProperty } from '@nestjs/swagger';
export class ResultData {
  constructor(resultData: { code?: number; message?: string; data?: any }) {
    const { code = 200, message, data } = resultData;
    this.code = code;
    this.message = message || 'ok';
    this.data = data || null;
  }

  @ApiProperty({ description: '结果码, 200 表示成功', type: 'number', default: 200 })
  code: number;

  @ApiProperty({ description: '结果描述, ok 表示成功', type: 'string', default: 'ok' })
  message?: string;

  data?: any;

  static ok(resultData: { code?: number; message?: string; data?: any }): ResultData {
    const { code = 200, message = 'ok', data } = resultData;
    return new ResultData({ code, message, data });
  }

  static fail(resultData: { code?: number; message?: string; data?: any }): ResultData {
    const { code = 200, message = 'fail', data } = resultData;
    return new ResultData({ code, message, data });
  }
}
