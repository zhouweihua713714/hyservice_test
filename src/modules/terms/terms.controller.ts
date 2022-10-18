import { ApiResult } from '@/common/decorators/apiResult.decorator';
import { ResultData } from '@/common/utils/result';
import { Body, Controller, Get, HttpCode, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AllowAnon } from '../../common/decorators/allowAnon.decorator';
import { SignInResInfo } from '../auth/auth.types';
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
  GetTermPercentByYearResult
)
@Controller('/terms')
export class TermsController {
  constructor(private readonly termsService: TermsService) {}

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
    summary: '项目类型时间分析(这里目前仅有教育人文社科项目有~但api均做方便以后拓展)',
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
}
