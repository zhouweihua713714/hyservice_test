import { ApiResult } from '@/common/decorators/apiResult.decorator';
import { ResultData } from '@/common/utils/result';
import { Body, Controller, Get, HttpCode, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AllowAnon } from '../../common/decorators/allowAnon.decorator';
import { SignInResInfo } from '../auth/auth.types';
import { SetHomepageDto } from './homepage.dto';
import { HomepageService } from './homepage.service';
import { GetHomepageConfigResult, GetHomepageHotKeywordsResult } from './homepage.types';

@ApiTags('首页配置')
@ApiExtraModels(ResultData, GetHomepageConfigResult, GetHomepageHotKeywordsResult)
@Controller('/homepage')
export class HomepageController {
  constructor(private readonly homepageService: HomepageService) {}

  @Get('/getHomepageConfig')
  @HttpCode(200)
  @ApiOperation({ summary: '获取首页配置数据' })
  @ApiResult(GetHomepageConfigResult)
  @AllowAnon()
  getHomepageConfig(@Query() params: any) {
    return this.homepageService.getHomepageConfig();
  }

  @Post('/setHomepage')
  @HttpCode(200)
  @ApiOperation({ summary: '设置首页' })
  @ApiResult()
  @ApiBearerAuth()
  countResourceByStatus(@Body() params: SetHomepageDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.homepageService.setHomepage(params, user);
  }
  @Get('/getHomepageHotKeywords')
  @HttpCode(200)
  @ApiOperation({
    summary: '获取首页热搜关键词(不区分类型且暂时过滤专利的关键词)',
  })
  @ApiResult(GetHomepageHotKeywordsResult)
  @AllowAnon()
  getHomepageHotKeywords(@Query() params: any) {
    return this.homepageService.getHomepageHotKeywords(params);
  }
}
