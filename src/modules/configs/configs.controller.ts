import { ApiResult } from '@/common/decorators/apiResult.decorator';
import { ResultData } from '@/common/utils/result';
import { Body, Controller, Get, HttpCode, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AllowAnon } from '../../common/decorators/allowAnon.decorator';
import { SignInResInfo } from '../auth/auth.types';
import { SetConfigsDto } from './configs.dto';
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
  GetSubjectsResult,
  GetTermTypesResult,
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
  GetTermTypesResult
)
@Controller('/configs')
export class ConfigsController {
  constructor(private readonly homepageService: ConfigsService) {}

  @Get('/getArticleTypes')
  @HttpCode(200)
  @ApiOperation({ summary: '获取文章类型' })
  @ApiResult(GetArticleTypesResult)
  @AllowAnon()
  getArticleTypes(@Query() params: any) {
    return this.homepageService.getArticleTypes();
  }

  @Get('/getColumns')
  @HttpCode(200)
  @ApiOperation({ summary: '获取栏目数据' })
  @ApiResult(GetColumnsResult)
  @AllowAnon()
  getColumns(@Query() params: any) {
    return this.homepageService.getColumns();
  }

  @Get('/getFields')
  @HttpCode(200)
  @ApiOperation({ summary: '获取领域数据' })
  @ApiResult(GetFieldsResult)
  @AllowAnon()
  getFields(@Query() params: any) {
    return this.homepageService.getFields();
  }

  @Get('/getLanguages')
  @HttpCode(200)
  @ApiOperation({ summary: '获取语种数据' })
  @ApiResult(GetLanguagesResult)
  @AllowAnon()
  getLanguages(@Query() params: any) {
    return this.homepageService.getLanguages();
  }

  @Get('/getPatentTypes')
  @HttpCode(200)
  @ApiOperation({ summary: '获取专利类型数据' })
  @ApiResult(GetPatentTypesResult)
  @AllowAnon()
  getPatentTypes(@Query() params: any) {
    return this.homepageService.getPatentTypes();
  }

  @Get('/getPatentValidTypes')
  @HttpCode(200)
  @ApiOperation({ summary: '获取专利有效性数据' })
  @ApiResult(GetPatentValidTypesResult)
  @AllowAnon()
  getPatentValidTypes(@Query() params: any) {
    return this.homepageService.getPatentValidTypes();
  }

  @Get('/getPeriodicalPeriods')
  @HttpCode(200)
  @ApiOperation({ summary: '获取发刊周期数据' })
  @ApiResult(GetPeriodicalPeriodsResult)
  @AllowAnon()
  getPeriodicalPeriods(@Query() params: any) {
    return this.homepageService.getPeriodicalPeriods();
  }

  @Get('/getPolicyTypes')
  @HttpCode(200)
  @ApiOperation({ summary: '获取政策类型' })
  @ApiResult(GetPolicyTypesResult)
  @AllowAnon()
  getPolicyTypes(@Query() params: any) {
    return this.homepageService.getPolicyTypes();
  }

  @Get('/getSubjects')
  @HttpCode(200)
  @ApiOperation({ summary: '获取学科分类数据' })
  @ApiResult(GetSubjectsResult)
  @AllowAnon()
  getSubjects(@Query() params: any) {
    return this.homepageService.getSubjects();
  }

  @Get('/getTermTypes')
  @HttpCode(200)
  @ApiOperation({ summary: '获取政策类型' })
  @ApiResult(GetTermTypesResult)
  @AllowAnon()
  getTermTypes(@Query() params: any) {
    return this.homepageService.getTermTypes();
  }
}
