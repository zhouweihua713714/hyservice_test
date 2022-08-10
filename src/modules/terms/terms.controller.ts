import { ApiResult } from '@/common/decorators/apiResult.decorator';
import { ResultData } from '@/common/utils/result';
import { Body, Controller, Get, HttpCode, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AllowAnon } from '../../common/decorators/allowAnon.decorator';
import { SignInResInfo } from '../auth/auth.types';
import { GetTermDetailDto, SaveTermDto } from './terms.dto';
import { TermsService } from './terms.service';
import { GetTermsDetailResult } from './terms.types';

@ApiTags('内容管理-项目')
@ApiExtraModels(ResultData, GetTermsDetailResult)
@Controller('/terms')
export class TermsController {
  constructor(private readonly termsService: TermsService) {}

  @Get('/getTermDetail')
  @HttpCode(200)
  @ApiOperation({ summary: '获取项目详情' })
  @ApiResult(GetTermsDetailResult)
  @AllowAnon()
  getTermsConfig(@Query() params: GetTermDetailDto) {
    return this.termsService.getTermDetail(params);
  }

  @Post('/saveTerms')
  @HttpCode(200)
  @ApiOperation({ summary: '新增/编辑项目' })
  @ApiResult()
  @ApiBearerAuth()
  countResourceByStatus(@Body() params: SaveTermDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.termsService.saveTerm(params, user);
  }
}
