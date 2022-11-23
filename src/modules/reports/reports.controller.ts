import { ApiResult } from '@/common/decorators/apiResult.decorator';
import { ResultData } from '@/common/utils/result';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllowAnon } from '../../common/decorators/allowAnon.decorator';
import { ListResearchReportsDto } from './reports.dto';
import { ListResearchReportsResult } from './reports.types';
import { ResearchReportsService } from './researchReports/researchReportsService.service';

@ApiTags('报告')
@ApiExtraModels(ResultData, ListResearchReportsResult)
@Controller('/reports')
export class ReportsController {
  constructor(private readonly researchReportsService: ResearchReportsService) {}

  @Post('/listResearchReports')
  @HttpCode(200)
  @ApiOperation({
    summary: '研究报告列表(c端)',
  })
  @ApiResult(ListResearchReportsResult)
  @AllowAnon()
  listResearchReports(@Body() params: ListResearchReportsDto) {
    return this.researchReportsService.listResearchReports(params);
  }
}
