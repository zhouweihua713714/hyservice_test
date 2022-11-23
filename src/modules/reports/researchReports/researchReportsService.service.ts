import _ from 'lodash';
import { ResultData } from '@/common/utils/result';
import { IsNull } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ListResearchReportsDto } from '../reports.dto';
import { researchReportsRepository } from '@/modules/repository/repository';
import { Content_Status_Enum } from '@/common/enums/common.enum';

@Injectable()
export class ResearchReportsService {
  /**
   * @description 研究报告列表(c端)
   * @param {ListResearchReportsDto} params
   * @returns {ResultData} 返回listResearchReports信息
   */
  async listResearchReports(
    params: ListResearchReportsDto,
  ): Promise<ResultData> {
    const { page, size } = params;
    // get reports
    const [reports, count] = await researchReportsRepository.findAndCount({
      where: {
        enabled: true,
        deletedAt: IsNull(),
        status: Content_Status_Enum.ACTIVE,
      },
      select: [
        'id',
        'title',
        'abstract',
        'author',
        'downloads',
        'publishedAt',
        'url'
      ],
      skip: (page - 1) * size,
      take: size,
      order: {
        publishedAt: 'DESC',
      },
    });
    return ResultData.ok({ data: { reports, count: count } });
  }
}
