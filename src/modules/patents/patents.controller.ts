import { ApiResult } from '@/common/decorators/apiResult.decorator';
import { ResultData } from '@/common/utils/result';
import { Body, Controller, Get, HttpCode, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AllowAnon } from '../../common/decorators/allowAnon.decorator';
import { SignInResInfo } from '../auth/auth.types';
import {
  GetPatentDetailDto,
  ListPatentDto,
  OperatePatentsDto,
  RemovePatentsDto,
  SavePatentDto,
} from './patents.dto';
import { PatentsService } from './patents.service';
import {
  GetPatentDetailResult,
  ListPatentResult,
  OperatePatentsResult,
  RemovePatentsResult,
  SavePatentResult,
} from './patents.types';

@ApiTags('内容管理-专利')
@ApiExtraModels(
  ResultData,
  GetPatentDetailResult,
  ListPatentResult,
  OperatePatentsResult,
  RemovePatentsResult,
  SavePatentResult
)
@Controller('/patents')
export class PatentsController {
  constructor(private readonly termsService: PatentsService) {}

  @Get('/getPatentDetail')
  @HttpCode(200)
  @ApiOperation({ summary: '获取专利详情' })
  @ApiResult(GetPatentDetailResult)
  @AllowAnon()
  getPatentDetail(@Query() params: GetPatentDetailDto) {
    return this.termsService.getPatentDetail(params);
  }

  @Post('/savePatent')
  @HttpCode(200)
  @ApiOperation({ summary: '新增/编辑专利' })
  @ApiResult(SavePatentResult)
  @ApiBearerAuth()
  savePatent(@Body() params: SavePatentDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.termsService.savePatent(params, user);
  }

  // @Get('/listPatent')
  // @HttpCode(200)
  // @ApiOperation({ summary: '专利列表' })
  // @ApiResult(ListPatentResult)
  // @ApiBearerAuth()
  // listPatent(@Query() params: ListPatentDto, @Req() req: any) {
  //   const user = <SignInResInfo>req.user;
  //   return this.termsService.listPatent(params, user);
  // }

  // @Post('/operatePatents')
  // @HttpCode(200)
  // @ApiOperation({ summary: '操作专利(发布、待发布)' })
  // @ApiResult(OperatePatentsResult)
  // @ApiBearerAuth()
  // operatePatents(@Body() params: OperatePatentsDto, @Req() req: any) {
  //   const user = <SignInResInfo>req.user;
  //   return this.termsService.operatePatents(params, user);
  // }

  // @Post('/removePatents')
  // @HttpCode(200)
  // @ApiOperation({ summary: '删除专利' })
  // @ApiResult(RemovePatentsResult)
  // @ApiBearerAuth()
  // removePatents(@Body() params: RemovePatentsDto, @Req() req: any) {
  //   const user = <SignInResInfo>req.user;
  //   return this.termsService.removePatents(params, user);
  // }
}
