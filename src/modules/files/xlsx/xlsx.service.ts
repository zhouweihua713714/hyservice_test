import _ from 'lodash';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilesDao } from '../files.dao';
import { AuthService } from '@/modules/auth/auth.service';
import xlsx from 'node-xlsx';
import { ResultData } from '@/common/utils/result';
@Injectable()
export class XlsxService {
  constructor(
    private readonly config: ConfigService,
    private readonly filesDao: FilesDao,
    private readonly authService: AuthService
  ) {}

  /**
   * @description xlsx 文件解析
   * @param {object} params xlsx 文件信息
   * @returns {object} req 请求信息
   */
  async parseXlsx(params: any, req: any): Promise<Record<string, any>> {
    const data = xlsx.parse(`${__dirname}/hy-data.xlsx`);
    // console.log(data[0])
    return ResultData.ok({});
  }
}
