import { ApiResult } from '@/common/decorators/apiResult.decorator';
import { ResultData } from '@/common/utils/result';
import { Body, Controller, Get, HttpCode, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllowAnon } from '../../common/decorators/allowAnon.decorator';
import { SignInResInfo } from '../auth/auth.types';
import {
  GetInstitutionDetailDto,
  ListComplexInstitutionDto,
  ListInstitutionDto,
  OperateInstitutionsDto,
  RecommendInstitutionsDto,
  RemoveInstitutionsDto,
  SaveInstitutionDto,
} from './institutions.dto';
import { InstitutionsService } from './institutions.service';
import {
  GetInstitutionDetailResult,
  GetInstitutionsByCoordinateResult,
  ListComplexInstitutionResult,
  ListInstitutionResult,
  OperateInstitutionsResult,
  RecommendInstitutionsResult,
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
  SaveInstitutionResult,
  ListComplexInstitutionResult,
  RecommendInstitutionsResult,
  GetInstitutionsByCoordinateResult
)
@Controller('/institutions')
export class InstitutionsController {
  constructor(private readonly institutionsService: InstitutionsService) {}

  @Get('/getInstitutionDetail')
  @HttpCode(200)
  @ApiOperation({ summary: '获取机构详情' })
  @ApiResult(GetInstitutionDetailResult)
  @AllowAnon()
  getInstitutionDetail(@Query() params: GetInstitutionDetailDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.institutionsService.getInstitutionDetail(params, user);
  }

  @Post('/saveInstitution')
  @HttpCode(200)
  @ApiOperation({ summary: '新增/编辑机构' })
  @ApiResult(SaveInstitutionResult)
  @ApiBearerAuth()
  saveInstitution(@Body() params: SaveInstitutionDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.institutionsService.saveInstitution(params, user);
  }

  @Get('/listInstitution')
  @HttpCode(200)
  @ApiOperation({ summary: '机构列表' })
  @ApiResult(ListInstitutionResult)
  @ApiBearerAuth()
  listInstitution(@Query() params: ListInstitutionDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.institutionsService.listInstitution(params, user);
  }

  @Post('/operateInstitutions')
  @HttpCode(200)
  @ApiOperation({ summary: '操作机构(发布、待发布)' })
  @ApiResult(OperateInstitutionsResult)
  @ApiBearerAuth()
  operateInstitutions(@Body() params: OperateInstitutionsDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.institutionsService.operateInstitutions(params, user);
  }

  @Post('/removeInstitutions')
  @HttpCode(200)
  @ApiOperation({ summary: '删除机构' })
  @ApiResult(RemoveInstitutionsResult)
  @ApiBearerAuth()
  removeInstitutions(@Body() params: RemoveInstitutionsDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.institutionsService.removeInstitutions(params, user);
  }

  @Post('/listComplexInstitution')
  @HttpCode(200)
  @ApiOperation({ summary: '结构列表(c端)' })
  @ApiResult(ListComplexInstitutionResult)
  @AllowAnon()
  listComplexTerm(@Body() params: ListComplexInstitutionDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.institutionsService.listComplexInstitution(params, user);
  }

  @Post('/recommendInstitutions')
  @HttpCode(200)
  @ApiOperation({ summary: '机构推荐列表(为您推荐)' })
  @ApiResult(RecommendInstitutionsResult)
  @AllowAnon()
  recommendInstitutions(@Body() params: RecommendInstitutionsDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.institutionsService.recommendInstitutions(params, user);
  }

  @Get('/getInstitutionsByCoordinate')
  @HttpCode(200)
  @ApiOperation({ summary: '获取所有机构坐标(机构分布)' })
  @ApiResult(GetInstitutionsByCoordinateResult)
  @AllowAnon()
  getInstitutionsByCoordinate(@Query() params: any, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.institutionsService.getInstitutionsByCoordinate(params, user);
  }
}
