import { ApiResult } from '@/common/decorators/apiResult.decorator';
import { ResultData } from '@/common/utils/result';
import { Body, Controller, Get, HttpCode, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AllowAnon } from '../../common/decorators/allowAnon.decorator';
import { SignInResInfo } from '../auth/auth.types';
import {
  GetPolicyDetailDto,
  ListPolicyDto,
  OperatePoliciesDto,
  RemovePoliciesDto,
  SavePolicyDto,
} from './policies.dto';
import { PoliciesService } from './policies.service';
import {
  GetPolicyDetailResult,
  ListPolicyResult,
  OperatePoliciesResult,
  RemovePoliciesResult,
  SavePolicyResult,
} from './policies.types';

@ApiTags('内容管理-政策')
@ApiExtraModels(
  ResultData,
  GetPolicyDetailResult,
  ListPolicyResult,
  OperatePoliciesResult,
  RemovePoliciesResult,
  SavePolicyResult
)
@Controller('/policies')
export class PoliciesController {
  constructor(private readonly policiesService: PoliciesService) {}

  // @Get('/getPolicyDetail')
  // @HttpCode(200)
  // @ApiOperation({ summary: '获取政策详情' })
  // @ApiResult(GetPolicyDetailResult)
  // @AllowAnon()
  // getPolicyDetail(@Query() params: GetPolicyDetailDto) {
  //   return this.policiesService.getPolicyDetail(params);
  // }

  @Post('/savePolicy')
  @HttpCode(200)
  @ApiOperation({ summary: '新增/编辑政策' })
  @ApiResult(SavePolicyResult)
  @ApiBearerAuth()
  savePolicy(@Body() params: SavePolicyDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.policiesService.savePolicy(params, user);
  }

  // @Get('/listPolicy')
  // @HttpCode(200)
  // @ApiOperation({ summary: '政策列表' })
  // @ApiResult(ListPolicyResult)
  // @ApiBearerAuth()
  // listPolicy(@Query() params: ListPolicyDto, @Req() req: any) {
  //   const user = <SignInResInfo>req.user;
  //   return this.policiesService.listPolicy(params, user);
  // }

  // @Post('/operatePolicies')
  // @HttpCode(200)
  // @ApiOperation({ summary: '操作政策(发布、待发布)' })
  // @ApiResult(OperatePoliciesResult)
  // @ApiBearerAuth()
  // operatePolicies(@Body() params: OperatePoliciesDto, @Req() req: any) {
  //   const user = <SignInResInfo>req.user;
  //   return this.policiesService.operatePolicies(params, user);
  // }

  // @Post('/removePolicies')
  // @HttpCode(200)
  // @ApiOperation({ summary: '删除政策' })
  // @ApiResult(RemovePoliciesResult)
  // @ApiBearerAuth()
  // removePolicies(@Body() params: RemovePoliciesDto, @Req() req: any) {
  //   const user = <SignInResInfo>req.user;
  //   return this.policiesService.removePolicies(params, user);
  // }
}
