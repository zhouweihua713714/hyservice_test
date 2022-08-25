import { ApiResult } from '@/common/decorators/apiResult.decorator';
import { ResultData } from '@/common/utils/result';
import { Body, Controller, Get, HttpCode, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AllowAnon } from '../../common/decorators/allowAnon.decorator';
import { SignInResInfo } from '../auth/auth.types';
import {
  GetPeriodicalDetailDto,
  ListPeriodicalDto,
  OperatePeriodicalsDto,
  RemovePeriodicalsDto,
  SavePeriodicalDto,
} from './periodicals.dto';
import { PeriodicalsService } from './periodicals.service';
import {
  GetPeriodicalDetailResult,
  ListPeriodicalResult,
  OperatePeriodicalsResult,
  RemovePeriodicalsResult,
  SavePeriodicalResult,
} from './periodicals.types';

@ApiTags('内容管理-期刊')
@ApiExtraModels(
  ResultData,
  GetPeriodicalDetailResult,
  ListPeriodicalResult,
  OperatePeriodicalsResult,
  RemovePeriodicalsResult,
  SavePeriodicalResult
)
@Controller('/periodicals')
export class PeriodicalsController {
  constructor(private readonly termsService: PeriodicalsService) {}

  @Get('/getPeriodicalDetail')
  @HttpCode(200)
  @ApiOperation({ summary: '获取期刊详情' })
  @ApiResult(GetPeriodicalDetailResult)
  @AllowAnon()
  getPeriodicalDetail(@Query() params: GetPeriodicalDetailDto) {
    return this.termsService.getPeriodicalDetail(params);
  }

  @Post('/savePeriodical')
  @HttpCode(200)
  @ApiOperation({ summary: '新增/编辑期刊' })
  @ApiResult(SavePeriodicalResult)
  @ApiBearerAuth()
  savePeriodical(@Body() params: SavePeriodicalDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.termsService.savePeriodical(params, user);
  }

  @Get('/listPeriodical')
  @HttpCode(200)
  @ApiOperation({ summary: '期刊列表' })
  @ApiResult(ListPeriodicalResult)
  @ApiBearerAuth()
  listPeriodical(@Query() params: ListPeriodicalDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.termsService.listPeriodical(params, user);
  }

  @Post('/operatePeriodicals')
  @HttpCode(200)
  @ApiOperation({ summary: '操作期刊(发布、待发布)' })
  @ApiResult(OperatePeriodicalsResult)
  @ApiBearerAuth()
  operatePeriodicals(@Body() params: OperatePeriodicalsDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.termsService.operatePeriodicals(params, user);
  }

  @Post('/removePeriodicals')
  @HttpCode(200)
  @ApiOperation({ summary: '删除期刊' })
  @ApiResult(RemovePeriodicalsResult)
  @ApiBearerAuth()
  removePeriodicals(@Body() params: RemovePeriodicalsDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.termsService.removePeriodicals(params, user);
  }
}
