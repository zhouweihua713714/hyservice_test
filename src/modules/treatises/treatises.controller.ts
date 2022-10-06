import { ApiResult } from '@/common/decorators/apiResult.decorator';
import { ResultData } from '@/common/utils/result';
import { Body, Controller, Get, HttpCode, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AllowAnon } from '../../common/decorators/allowAnon.decorator';
import { SignInResInfo } from '../auth/auth.types';
import {
  GetInstitutionChartsDto,
  GetTreatiseDetailDto,
  ListComplexTreatiseDto,
  ListTreatiseDto,
  OperateTreatisesDto,
  RecommendTreatisesDto,
  RemoveTreatisesDto,
  SaveTreatiseDto,
} from './treatises.dto';
import { TreatisesService } from './treatises.service';
import {
  GetArticleCountResult,
  GetInstitutionChartsResult,
  GetTreatiseDetailResult,
  ListComplexTreatiseResult,
  ListTreatiseResult,
  OperateTreatisesResult,
  RecommendTreatisesResult,
  RemoveTreatisesResult,
  SaveTreatiseResult,
} from './treatises.types';

@ApiTags('内容管理-论文')
@ApiExtraModels(
  ResultData,
  GetTreatiseDetailResult,
  ListTreatiseResult,
  OperateTreatisesResult,
  RemoveTreatisesResult,
  SaveTreatiseResult,
  GetArticleCountResult,
  ListComplexTreatiseResult,
  RecommendTreatisesResult,
  GetInstitutionChartsResult
)
@Controller('/treatises')
export class TreatisesController {
  constructor(private readonly treatisesService: TreatisesService) {}

  @Get('/getTreatiseDetail')
  @HttpCode(200)
  @ApiOperation({ summary: '获取论文详情' })
  @ApiResult(GetTreatiseDetailResult)
  @AllowAnon()
  getTreatiseDetail(@Query() params: GetTreatiseDetailDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.treatisesService.getTreatiseDetail(params, user);
  }

  @Post('/saveTreatise')
  @HttpCode(200)
  @ApiOperation({ summary: '新增/编辑论文' })
  @ApiResult(SaveTreatiseResult)
  @ApiBearerAuth()
  saveTreatise(@Body() params: SaveTreatiseDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.treatisesService.saveTreatise(params, user);
  }

  @Get('/listTreatise')
  @HttpCode(200)
  @ApiOperation({ summary: '论文列表' })
  @ApiResult(ListTreatiseResult)
  @ApiBearerAuth()
  listTreatises(@Query() params: ListTreatiseDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.treatisesService.listTreatise(params, user);
  }

  @Post('/operateTreatises')
  @HttpCode(200)
  @ApiOperation({ summary: '操作论文(发布、待发布)' })
  @ApiResult(OperateTreatisesResult)
  @ApiBearerAuth()
  operateTreatises(@Body() params: OperateTreatisesDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.treatisesService.operateTreatises(params, user);
  }

  @Post('/removeTreatises')
  @HttpCode(200)
  @ApiOperation({ summary: '删除论文' })
  @ApiResult(RemoveTreatisesResult)
  @ApiBearerAuth()
  removeTreatises(@Body() params: RemoveTreatisesDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.treatisesService.removeTreatises(params, user);
  }

  @Get('/getArticleCount')
  @HttpCode(200)
  @ApiOperation({ summary: '获取论文分类下的文章数量' })
  @ApiResult(GetArticleCountResult)
  @AllowAnon()
  getArticleCount(@Query() params: any, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.treatisesService.getArticleCount(params, user);
  }

  @Post('/listComplexTreatise')
  @HttpCode(200)
  @ApiOperation({ summary: '论文列表(c端)' })
  @ApiResult(ListComplexTreatiseResult)
  @AllowAnon()
  listComplexTreatise(@Body() params: ListComplexTreatiseDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.treatisesService.listComplexTreatise(params, user);
  }

  @Post('/recommendTreatises')
  @HttpCode(200)
  @ApiOperation({ summary: '论文推荐列表(为您推荐)' })
  @ApiResult(RecommendTreatisesResult)
  @AllowAnon()
  recommendTreatises(@Body() params: RecommendTreatisesDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.treatisesService.recommendTreatises(params, user);
  }

  @Get('/getInstitutionCharts')
  @HttpCode(200)
  @ApiOperation({ summary: '文献发表机构排名(TOP10)' })
  @ApiResult(GetInstitutionChartsResult)
  @AllowAnon()
  getInstitutionCharts(@Query() params: GetInstitutionChartsDto) {
    return this.treatisesService.getInstitutionCharts(params);
  }
}
