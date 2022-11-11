import { ApiResult } from '@/common/decorators/apiResult.decorator';
import { ResultData } from '@/common/utils/result';
import { Body, Controller, Get, HttpCode, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllowAnon } from '../../common/decorators/allowAnon.decorator';
import { SignInResInfo } from '../auth/auth.types';
import {
  GetConferenceDetailDto,
  ListComplexConferenceDto,
  ListConferenceDto,
  ListRecentConferenceDto,
  OperateConferencesDto,
  RecommendConferencesDto,
  RemoveConferencesDto,
  SaveConferenceDto,
} from './conferences.dto';
import { ConferencesService } from './conferences.service';
import {
  GetConferenceDetailResult,
  ListComplexConferenceResult,
  ListConferenceResult,
  ListRecentConferenceResult,
  OperateConferencesResult,
  RecommendConferencesResult,
  RemoveConferencesResult,
  SaveConferenceResult,
} from './conferences.types';

@ApiTags('内容管理-会议')
@ApiExtraModels(
  ResultData,
  GetConferenceDetailResult,
  ListConferenceResult,
  OperateConferencesResult,
  RemoveConferencesResult,
  SaveConferenceResult,
  ListComplexConferenceResult,
  ListRecentConferenceResult,
  RecommendConferencesResult
)
@Controller('/conferences')
export class ConferencesController {
  constructor(private readonly conferencesService: ConferencesService) {}

  @Get('/getConferenceDetail')
  @HttpCode(200)
  @ApiOperation({ summary: '获取会议详情' })
  @ApiResult(GetConferenceDetailResult)
  @AllowAnon()
  getConferenceDetail(@Query() params: GetConferenceDetailDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.conferencesService.getConferenceDetail(params, user);
  }

  @Post('/saveConference')
  @HttpCode(200)
  @ApiOperation({ summary: '新增/编辑会议' })
  @ApiResult(SaveConferenceResult)
  @ApiBearerAuth()
  saveConference(@Body() params: SaveConferenceDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.conferencesService.saveConference(params, user);
  }

  @Get('/listConference')
  @HttpCode(200)
  @ApiOperation({ summary: '会议列表' })
  @ApiResult(ListConferenceResult)
  @ApiBearerAuth()
  listConference(@Query() params: ListConferenceDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.conferencesService.listConference(params, user);
  }

  @Post('/operateConferences')
  @HttpCode(200)
  @ApiOperation({ summary: '操作会议(发布、待发布)' })
  @ApiResult(OperateConferencesResult)
  @ApiBearerAuth()
  operateConferences(@Body() params: OperateConferencesDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.conferencesService.operateConferences(params, user);
  }

  @Post('/removeConferences')
  @HttpCode(200)
  @ApiOperation({ summary: '删除会议' })
  @ApiResult(RemoveConferencesResult)
  @ApiBearerAuth()
  removeConferences(@Body() params: RemoveConferencesDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.conferencesService.removeConferences(params, user);
  }

  @Post('/listComplexConference')
  @HttpCode(200)
  @ApiOperation({ summary: '会议列表(c端)' })
  @ApiResult(ListComplexConferenceResult)
  @AllowAnon()
  listComplexTerm(@Body() params: ListComplexConferenceDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.conferencesService.listComplexConference(params, user);
  }

  @Get('/listRecentConference')
  @HttpCode(200)
  @ApiOperation({ summary: '最近会议TOP4' })
  @ApiResult(ListRecentConferenceResult)
  @AllowAnon()
  listRecentConference(@Query() params: ListRecentConferenceDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.conferencesService.listRecentConference(params, user);
  }

  @Post('/recommendConferences')
  @HttpCode(200)
  @ApiOperation({ summary: '会议推荐列表(为您推荐)' })
  @ApiResult(RecommendConferencesResult)
  @AllowAnon()
  recommendConferences(@Body() params: RecommendConferencesDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.conferencesService.recommendConferences(params, user);
  }
}
