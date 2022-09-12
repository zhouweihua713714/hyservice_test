import { ApiResult } from '@/common/decorators/apiResult.decorator';
import { ResultData } from '@/common/utils/result';
import { Body, Controller, Get, HttpCode, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AllowAnon } from '../../common/decorators/allowAnon.decorator';
import { SignInResInfo } from '../auth/auth.types';
import {
  GetTermDetailDto,
  ListTermDto,
  OperateTermsDto,
  RemoveTermsDto,
  SaveTermDto,
} from './terms.dto';
import { TermsService } from './terms.service';
import {
  GetTermDetailResult,
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
  SaveTermResult
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
    return this.termsService.getTermDetail(params,user);
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
}
