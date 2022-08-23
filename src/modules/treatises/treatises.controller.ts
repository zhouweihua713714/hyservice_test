import { ApiResult } from '@/common/decorators/apiResult.decorator';
import { ResultData } from '@/common/utils/result';
import { Body, Controller, Get, HttpCode, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AllowAnon } from '../../common/decorators/allowAnon.decorator';
import { SignInResInfo } from '../auth/auth.types';
import {
  GetTreatiseDetailDto,
  ListTreatiseDto,
  OperateTreatisesDto,
  RemoveTreatisesDto,
  SaveTreatiseDto,
} from './treatises.dto';
import { TreatisesService } from './treatises.service';
import {
  GetTreatisesDetailResult,
  ListTreatiseResult,
  OperateTreatisesResult,
  RemoveTreatisesResult,
  SaveTreatiseResult,
} from './treatises.types';

@ApiTags('内容管理-论文')
@ApiExtraModels(
  ResultData,
  GetTreatisesDetailResult,
  ListTreatiseResult,
  OperateTreatisesResult,
  RemoveTreatisesResult,
  SaveTreatiseResult
)
@Controller('/treatises')
export class TreatisesController {
  constructor(private readonly termsService: TreatisesService) {}

  @Get('/getTreatiseDetail')
  @HttpCode(200)
  @ApiOperation({ summary: '获取论文详情' })
  @ApiResult(GetTreatisesDetailResult)
  @AllowAnon()
  getTreatisesDetail(@Query() params: GetTreatiseDetailDto) {
    return this.termsService.getTreatiseDetail(params);
  }

  @Post('/saveTreatise')
  @HttpCode(200)
  @ApiOperation({ summary: '新增/编辑论文' })
  @ApiResult(SaveTreatiseResult)
  @ApiBearerAuth()
  saveTreatises(@Body() params: SaveTreatiseDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.termsService.saveTreatise(params, user);
  }

  @Get('/listTreatise')
  @HttpCode(200)
  @ApiOperation({ summary: '论文列表' })
  @ApiResult(ListTreatiseResult)
  @ApiBearerAuth()
  listTreatises(@Query() params: ListTreatiseDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.termsService.listTreatise(params, user);
  }

  // @Post('/operateTreatises')
  // @HttpCode(200)
  // @ApiOperation({ summary: '操作论文(发布、待发布)' })
  // @ApiResult(OperateTreatisesResult)
  // @ApiBearerAuth()
  // operateTreatises(@Body() params: OperateTreatisesDto, @Req() req: any) {
  //   const user = <SignInResInfo>req.user;
  //   return this.termsService.operateTreatises(params, user);
  // }

  // @Post('/removeTreatises')
  // @HttpCode(200)
  // @ApiOperation({ summary: '删除论文' })
  // @ApiResult(RemoveTreatisesResult)
  // @ApiBearerAuth()
  // removeTreatises(@Body() params: RemoveTreatisesDto, @Req() req: any) {
  //   const user = <SignInResInfo>req.user;
  //   return this.termsService.removeTreatises(params, user);
  // }
}
