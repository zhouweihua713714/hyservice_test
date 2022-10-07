import { ApiResult } from '@/common/decorators/apiResult.decorator';
import { ResultData } from '@/common/utils/result';
import { Body, Controller, Get, HttpCode, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AllowAnon } from '../../common/decorators/allowAnon.decorator';
import { SignInResInfo } from '../auth/auth.types';
import { GetSearchResultByKeywordDto, SetColumnsOrderDto, SetColumnsTypeDto } from './configs.dto';
import { ConfigsService } from './configs.service';
import {
  GetArticleTypesResult,
  GetColumnsResult,
  GetConfigsConfigResult,
  GetFieldsResult,
  GetLanguagesResult,
  GetPatentTypesResult,
  GetPatentValidTypesResult,
  GetPeriodicalPeriodsResult,
  GetPolicyTypesResult,
  GetSearchResultByKeywordResult,
  GetSubjectsResult,
  GetTermTypesResult,
  GetTopicTypesResult,
  GetUniversitiesResult,
  SetColumnsTypeResult,
} from './configs.types';

@ApiTags('配置数据')
@ApiExtraModels(
  ResultData,
  GetConfigsConfigResult,
  GetArticleTypesResult,
  GetColumnsResult,
  GetFieldsResult,
  GetLanguagesResult,
  GetPatentTypesResult,
  GetPatentValidTypesResult,
  GetPeriodicalPeriodsResult,
  GetPolicyTypesResult,
  GetSubjectsResult,
  GetTermTypesResult,
  SetColumnsTypeResult,
  GetUniversitiesResult,
  GetTopicTypesResult,
  GetSearchResultByKeywordResult
)
@Controller('/configs')
export class ConfigsController {
  constructor(private readonly configService: ConfigsService) {}

  @Get('/getArticleTypes')
  @HttpCode(200)
  @ApiOperation({ summary: '获取文章类型' })
  @ApiResult(GetArticleTypesResult)
  @AllowAnon()
  getArticleTypes(@Query() params: any) {
    return this.configService.getArticleTypes();
  }

  @Get('/getColumns')
  @HttpCode(200)
  @ApiOperation({ summary: '获取栏目数据' })
  @ApiResult(GetColumnsResult)
  @AllowAnon()
  getColumns(@Query() params: any) {
    return this.configService.getColumns();
  }

  @Get('/getFields')
  @HttpCode(200)
  @ApiOperation({ summary: '获取领域数据' })
  @ApiResult(GetFieldsResult)
  @AllowAnon()
  getFields(@Query() params: any) {
    return this.configService.getFields();
  }

  @Get('/getLanguages')
  @HttpCode(200)
  @ApiOperation({ summary: '获取语种数据' })
  @ApiResult(GetLanguagesResult)
  @AllowAnon()
  getLanguages(@Query() params: any) {
    return this.configService.getLanguages();
  }

  @Get('/getPatentTypes')
  @HttpCode(200)
  @ApiOperation({ summary: '获取专利类型数据' })
  @ApiResult(GetPatentTypesResult)
  @AllowAnon()
  getPatentTypes(@Query() params: any) {
    return this.configService.getPatentTypes();
  }

  @Get('/getPatentValidTypes')
  @HttpCode(200)
  @ApiOperation({ summary: '获取专利有效性数据' })
  @ApiResult(GetPatentValidTypesResult)
  @AllowAnon()
  getPatentValidTypes(@Query() params: any) {
    return this.configService.getPatentValidTypes();
  }

  @Get('/getPeriodicalPeriods')
  @HttpCode(200)
  @ApiOperation({ summary: '获取发刊周期数据' })
  @ApiResult(GetPeriodicalPeriodsResult)
  @AllowAnon()
  getPeriodicalPeriods(@Query() params: any) {
    return this.configService.getPeriodicalPeriods();
  }

  @Get('/getPolicyTypes')
  @HttpCode(200)
  @ApiOperation({ summary: '获取政策类型' })
  @ApiResult(GetPolicyTypesResult)
  @AllowAnon()
  getPolicyTypes(@Query() params: any) {
    return this.configService.getPolicyTypes();
  }

  @Get('/getSubjects')
  @HttpCode(200)
  @ApiOperation({ summary: '获取学科分类数据' })
  @ApiResult(GetSubjectsResult)
  @AllowAnon()
  getSubjects(@Query() params: any) {
    return this.configService.getSubjects();
  }

  @Get('/getTermTypes')
  @HttpCode(200)
  @ApiOperation({ summary: '获取政策类型' })
  @ApiResult(GetTermTypesResult)
  @AllowAnon()
  getTermTypes(@Query() params: any) {
    return this.configService.getTermTypes();
  }

  @Post('/setColumnsType')
  @HttpCode(200)
  @ApiOperation({ summary: '设置栏目状态' })
  @ApiResult(SetColumnsTypeResult)
  @ApiBearerAuth()
  setColumnsType(@Body() params: SetColumnsTypeDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.configService.setColumnsType(params, user);
  }

  @Post('/setColumnsOrder')
  @HttpCode(200)
  @ApiOperation({ summary: '设置栏目排序(同组)' })
  @ApiResult()
  @ApiBearerAuth()
  setColumnsOrder(@Body() params: SetColumnsOrderDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.configService.setColumnsOrder(params, user);
  }

  @Get('/getUniversities')
  @HttpCode(200)
  @ApiOperation({ summary: '获取学校数据' })
  @ApiResult(GetUniversitiesResult)
  @AllowAnon()
  getUniversities(@Query() params: any) {
    return this.configService.getUniversities();
  }

  @Get('/getTopicTypes')
  @HttpCode(200)
  @ApiOperation({ summary: '获取主题类型数据' })
  @ApiResult(GetTopicTypesResult)
  @AllowAnon()
  getTopicTypes(@Query() params: any) {
    return this.configService.getTopicTypes();
  }

  @Get('/getSearchResultByKeyword')
  @HttpCode(200)
  @ApiOperation({ summary: '搜索返回关键词列表' })
  @ApiResult(GetSearchResultByKeywordResult)
  @AllowAnon()
  getSearchResultByKeyword(@Query() params: GetSearchResultByKeywordDto) {
    return this.configService.getSearchResultByKeyword(params);
  }
}
