import { ApiResult } from '@/common/decorators/apiResult.decorator';
import { ResultData } from '@/common/utils/result';
import { Body, Controller, Get, HttpCode, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AllowAnon } from '../../common/decorators/allowAnon.decorator';
import { SignInResInfo } from '../auth/auth.types';
import {
  GetInstitutionDetailDto,
  ListInstitutionDto,
  OperateInstitutionsDto,
  RemoveInstitutionsDto,
  SaveInstitutionDto,
} from './institutions.dto';
import { InstitutionsService } from './institutions.service';
import {
  GetInstitutionDetailResult,
  ListInstitutionResult,
  OperateInstitutionsResult,
  RemoveInstitutionsResult,
  SaveInstitutionResult,
} from './institutions.types';

@ApiTags('内容管理-机构')
@ApiExtraModels(
  ResultData,
  GetInstitutionDetailResult,
  ListInstitutionResult,
  OperateInstitutionsResult,
  RemoveInstitutionsResult,
  SaveInstitutionResult
)
@Controller('/institutions')
export class InstitutionsController {
  constructor(private readonly termsService: InstitutionsService) {}

  // @Get('/getInstitutionDetail')
  // @HttpCode(200)
  // @ApiOperation({ summary: '获取机构详情' })
  // @ApiResult(GetInstitutionDetailResult)
  // @AllowAnon()
  // getInstitutionDetail(@Query() params: GetInstitutionDetailDto) {
  //   return this.termsService.getInstitutionDetail(params);
  // }

  @Post('/saveInstitution')
  @HttpCode(200)
  @ApiOperation({ summary: '新增/编辑机构' })
  @ApiResult(SaveInstitutionResult)
  @ApiBearerAuth()
  saveInstitution(@Body() params: SaveInstitutionDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.termsService.saveInstitution(params, user);
  }

  // @Get('/listInstitution')
  // @HttpCode(200)
  // @ApiOperation({ summary: '机构列表' })
  // @ApiResult(ListInstitutionResult)
  // @ApiBearerAuth()
  // listInstitution(@Query() params: ListInstitutionDto, @Req() req: any) {
  //   const user = <SignInResInfo>req.user;
  //   return this.termsService.listInstitution(params, user);
  // }

  // @Post('/operateInstitutions')
  // @HttpCode(200)
  // @ApiOperation({ summary: '操作机构(发布、待发布)' })
  // @ApiResult(OperateInstitutionsResult)
  // @ApiBearerAuth()
  // operateInstitutions(@Body() params: OperateInstitutionsDto, @Req() req: any) {
  //   const user = <SignInResInfo>req.user;
  //   return this.termsService.operateInstitutions(params, user);
  // }

  // @Post('/removeInstitutions')
  // @HttpCode(200)
  // @ApiOperation({ summary: '删除机构' })
  // @ApiResult(RemoveInstitutionsResult)
  // @ApiBearerAuth()
  // removeInstitutions(@Body() params: RemoveInstitutionsDto, @Req() req: any) {
  //   const user = <SignInResInfo>req.user;
  //   return this.termsService.removeInstitutions(params, user);
  // }
}
