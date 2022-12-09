import { ApiResult } from '@/common/decorators/apiResult.decorator';
import { ResultData } from '@/common/utils/result';
import { Body, Controller, Get, HttpCode, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AllowAnon } from '../../common/decorators/allowAnon.decorator';
import { SignInResInfo } from '../auth/auth.types';
import {
  GetAmericaTermAmountByKeywordsDto,
  ListComplexAmericaTermDto,
} from './americaTerms/americaTerms.dto';
import { AmericaTermsService } from './americaTerms/americaTerms.service';
import {
  GetAmericaTermAmountByKeywordsResult,
  GetAmericaTermDistributionResult,
  GetAmericaTermHotOrganizationListResult,
  GetAmericaTermOverviewResult,
  ListComplexAmericaTermResult,
} from './americaTerms/americaTerms.types';
import {
  GetMoneyByYearDto,
  GetTermCountByProvinceDto,
  GetTermCountByTypeDto,
  GetTermCountByUnitDto,
  GetTermCountByYearDto,
  GetTermDetailDto,
  GetTermPercentBySubjectDto,
  ListComplexTermDto,
  ListTermDto,
  OperateTermsDto,
  RemoveTermsDto,
  SaveTermDto,
} from './terms.dto';
import { TermsService } from './terms.service';
import {
  GetMoneyByYearResult,
  GetTermCountByProvinceResult,
  GetTermCountByTypeResult,
  GetTermCountByUnitResult,
  GetTermCountByYearResult,
  GetTermDetailResult,
  GetTermPercentBySubjectResult,
  GetTermPercentByYearResult,
  ListComplexTermResult,
  ListTermResult,
  OperateTermsResult,
  RemoveTermsResult,
  SaveTermResult,
} from './terms.types';

@ApiTags('内容管理-项目')
@ApiExtraModels(
  ResultData,
  GetTermDetailResult,
  ListTermResult,
  OperateTermsResult,
  RemoveTermsResult,
  SaveTermResult,
  ListComplexTermResult,
  GetTermCountByUnitResult,
  GetTermCountByTypeResult,
  GetTermCountByYearResult,
  GetTermPercentBySubjectResult,
  GetMoneyByYearResult,
  GetTermCountByProvinceResult,
  GetTermPercentByYearResult,
  GetAmericaTermOverviewResult,
  GetAmericaTermDistributionResult,
  GetAmericaTermAmountByKeywordsResult,
  GetAmericaTermHotOrganizationListResult,
  ListComplexAmericaTermResult
)
@Controller('/terms')
export class TermsController {
  constructor(
    private readonly termsService: TermsService,
    private readonly americaTermsService: AmericaTermsService
  ) {}

  @Get('/getTermDetail')
  @HttpCode(200)
  @ApiOperation({ summary: '获取项目详情' })
  @ApiResult(GetTermDetailResult)
  @AllowAnon()
  getTermDetail(@Query() params: GetTermDetailDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.termsService.getTermDetail(params, user);
  }

  @Post('/saveTerm')
  @HttpCode(200)
  @ApiOperation({ summary: '新增/编辑项目' })
  @ApiResult(SaveTermResult)
  @ApiBearerAuth()
  saveTerm(@Body() params: SaveTermDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.termsService.saveTerm(params, user);
  }

  @Get('/listTerm')
  @HttpCode(200)
  @ApiOperation({ summary: '项目列表' })
  @ApiResult(ListTermResult)
  @ApiBearerAuth()
  listTerm(@Query() params: ListTermDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.termsService.listTerm(params, user);
  }

  @Post('/operateTerms')
  @HttpCode(200)
  @ApiOperation({ summary: '操作项目(发布、待发布)' })
  @ApiResult(OperateTermsResult)
  @ApiBearerAuth()
  operateTerms(@Body() params: OperateTermsDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.termsService.operateTerms(params, user);
  }

  @Post('/removeTerms')
  @HttpCode(200)
  @ApiOperation({ summary: '删除项目' })
  @ApiResult(RemoveTermsResult)
  @ApiBearerAuth()
  removeTerms(@Body() params: RemoveTermsDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.termsService.removeTerms(params, user);
  }

  @Post('/listComplexTerm')
  @HttpCode(200)
  @ApiOperation({ summary: '项目列表(c端)' })
  @ApiResult(ListComplexTermResult)
  @AllowAnon()
  listComplexTerm(@Body() params: ListComplexTermDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.termsService.listComplexTerm(params, user);
  }

  @Get('/getTermCountByUnit')
  @HttpCode(200)
  @ApiOperation({ summary: '依托单位分布(国家社会科学基金、教育部人文社科、国家自然科学基金项目)' })
  @ApiResult(GetTermCountByUnitResult)
  @AllowAnon()
  getTermCountByUnit(@Query() params: GetTermCountByUnitDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.termsService.getTermCountByUnit(params, user);
  }

  @Get('/getTermCountByType')
  @HttpCode(200)
  @ApiOperation({ summary: '项目类型分布' })
  @ApiResult(GetTermCountByTypeResult)
  @AllowAnon()
  getTermCountByType(@Query() params: GetTermCountByTypeDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.termsService.getTermCountByType(params, user);
  }

  @Get('/getTermCountByYear')
  @HttpCode(200)
  @ApiOperation({
    summary:
      '项目类型时间分析(这里目前仅有教育人文社科项目有~v0.2.0兼容且全国教育科学规划项目也有)',
  })
  @ApiResult(GetTermCountByYearResult)
  @AllowAnon()
  getTermCountByYear(@Query() params: GetTermCountByYearDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.termsService.getTermCountByYear(params, user);
  }

  @Get('/getTermPercentBySubject')
  @HttpCode(200)
  @ApiOperation({
    summary: '不同研究方向资助率(仅目前国家自然科学基金有~但api均做方便以后拓展)',
  })
  @ApiResult(GetTermPercentBySubjectResult)
  @AllowAnon()
  getTermPercentBySubject(@Query() params: GetTermPercentBySubjectDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.termsService.getTermPercentBySubject(params, user);
  }

  @Get('/getMoneyByYear')
  @HttpCode(200)
  @ApiOperation({
    summary: '资助金额分布(仅目前国家自然科学基金有~但api均做方便以后拓展)',
  })
  @ApiResult(GetMoneyByYearResult)
  @AllowAnon()
  getMoneyByYear(@Query() params: GetMoneyByYearDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.termsService.getMoneyByYear(params, user);
  }

  @Get('/getTermCountByProvince')
  @HttpCode(200)
  @ApiOperation({
    summary: '资助地区分布(仅目前国家自然科学基金有~但api均做方便以后拓展)',
  })
  @ApiResult(GetTermCountByProvinceResult)
  @AllowAnon()
  getTermCountByProvince(@Query() params: GetTermCountByProvinceDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.termsService.getTermCountByProvince(params, user);
  }

  @Get('/getTermPercentByYear')
  @HttpCode(200)
  @ApiOperation({ summary: '申请资助情况(仅目前国家自然科学基金,静态数据)' })
  @ApiResult(GetTermPercentByYearResult)
  @AllowAnon()
  getTermPercentByYear(@Query() params: any, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.termsService.getTermPercentByYear(params, user);
  }

  @Get('/getAmericaTermOverview')
  @HttpCode(200)
  @ApiOperation({ summary: '美国项目概览' })
  @ApiResult(GetAmericaTermOverviewResult)
  @AllowAnon()
  getAmericaTermOverview() {
    return this.americaTermsService.getAmericaTermOverview();
  }

  @Get('/getAmericaTermDistribution')
  @HttpCode(200)
  @ApiOperation({ summary: '美国项目立项单位分布' })
  @ApiResult(GetAmericaTermDistributionResult)
  @AllowAnon()
  getAmericaTermDistribution() {
    return this.americaTermsService.getAmericaTermDistribution();
  }

  @Get('/getAmericaTermAmountByKeywords')
  @HttpCode(200)
  @ApiOperation({ summary: '三个学部热力图, 总数前10个关键字' })
  @ApiResult(GetAmericaTermAmountByKeywordsResult)
  @AllowAnon()
  getAmericaTermAmountByKeywords(@Query() params: GetAmericaTermAmountByKeywordsDto) {
    return this.americaTermsService.getAmericaTermAmountByKeywords(params);
  }

  @Get('/getAmericaTermHotOrganizationList')
  @HttpCode(200)
  @ApiOperation({ summary: '热门研究单位' })
  @ApiResult(GetAmericaTermHotOrganizationListResult)
  @AllowAnon()
  getAmericaTermHotOrganizationList() {
    return this.americaTermsService.getAmericaTermHotOrganizationList();
  }

  @Post('/listComplexAmericaTerm')
  @HttpCode(200)
  @ApiOperation({ summary: '美国项目列表(c端)' })
  @ApiResult(ListComplexAmericaTermResult)
  @AllowAnon()
  listComplexAmericaTerm(@Body() params: ListComplexAmericaTermDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.americaTermsService.listComplexAmericaTerm(params, user);
  }
}
