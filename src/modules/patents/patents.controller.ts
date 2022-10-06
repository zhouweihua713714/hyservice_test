import { ApiResult } from '@/common/decorators/apiResult.decorator';
import { ResultData } from '@/common/utils/result';
import { Body, Controller, Get, HttpCode, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AllowAnon } from '../../common/decorators/allowAnon.decorator';
import { SignInResInfo } from '../auth/auth.types';
import {
  GetPatentChartsDto,
  GetPatentDetailDto,
  ListComplexPatentDto,
  ListPatentDto,
  OperatePatentsDto,
  RemovePatentsDto,
  SavePatentDto,
} from './patents.dto';
import { PatentsService } from './patents.service';
import {
  GePatentCountByAgentResult,
  GetPatentChartsResult,
  GetPatentDetailResult,
  ListComplexPatentResult,
  ListPatentResult,
  OperatePatentsResult,
  RemovePatentsResult,
  SavePatentResult,
} from './patents.types';

@ApiTags('内容管理-专利')
@ApiExtraModels(
  ResultData,
  GetPatentDetailResult,
  ListPatentResult,
  OperatePatentsResult,
  RemovePatentsResult,
  SavePatentResult,
  ListComplexPatentResult,
  GePatentCountByAgentResult,
  GetPatentChartsResult
)
@Controller('/patents')
export class PatentsController {
  constructor(private readonly patentsService: PatentsService) {}

  @Get('/getPatentDetail')
  @HttpCode(200)
  @ApiOperation({ summary: '获取专利详情' })
  @ApiResult(GetPatentDetailResult)
  @AllowAnon()
  getPatentDetail(@Query() params: GetPatentDetailDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.patentsService.getPatentDetail(params, user);
  }

  @Post('/savePatent')
  @HttpCode(200)
  @ApiOperation({ summary: '新增/编辑专利' })
  @ApiResult(SavePatentResult)
  @ApiBearerAuth()
  savePatent(@Body() params: SavePatentDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.patentsService.savePatent(params, user);
  }

  @Get('/listPatent')
  @HttpCode(200)
  @ApiOperation({ summary: '专利列表' })
  @ApiResult(ListPatentResult)
  @ApiBearerAuth()
  listPatent(@Query() params: ListPatentDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.patentsService.listPatent(params, user);
  }

  @Post('/operatePatents')
  @HttpCode(200)
  @ApiOperation({ summary: '操作专利(发布、待发布)' })
  @ApiResult(OperatePatentsResult)
  @ApiBearerAuth()
  operatePatents(@Body() params: OperatePatentsDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.patentsService.operatePatents(params, user);
  }

  @Post('/removePatents')
  @HttpCode(200)
  @ApiOperation({ summary: '删除专利' })
  @ApiResult(RemovePatentsResult)
  @ApiBearerAuth()
  removePatents(@Body() params: RemovePatentsDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.patentsService.removePatents(params, user);
  }

  @Post('/listComplexPatent')
  @HttpCode(200)
  @ApiOperation({ summary: '专利列表(c端)' })
  @ApiResult(ListComplexPatentResult)
  @AllowAnon()
  listComplexTerm(@Body() params: ListComplexPatentDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.patentsService.listComplexPatent(params, user);
  }

  @Get('/getPatentCountByAgent')
  @HttpCode(200)
  @ApiOperation({ summary: '高频发明人TOP10' })
  @ApiResult(GePatentCountByAgentResult)
  @AllowAnon()
  getPatentCountByAgent(@Query() params: any, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.patentsService.getPatentCountByAgent(params, user);
  }

  @Get('/getPatentCharts')
  @HttpCode(200)
  @ApiOperation({ summary: '专利图表统计(申请单位统计、年份统计、类型统计)' })
  @ApiResult(GetPatentChartsResult)
  @AllowAnon()
  getPatentCharts(@Query() params: GetPatentChartsDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.patentsService.getPatentCharts(params, user);
  }
}
