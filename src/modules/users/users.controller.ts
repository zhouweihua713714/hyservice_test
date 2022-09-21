import { ApiResult } from '@/common/decorators/apiResult.decorator';
import { ResultData } from '@/common/utils/result';
import { Body, Controller, Get, HttpCode, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AllowAnon } from '../../common/decorators/allowAnon.decorator';
import { SignInResInfo } from '../auth/auth.types';
import { UserFavoritesService } from './userFavorites/userFavorites.service';
import { ListHistoryDto } from './userHistory/userHistory.dto';
import { UserHistoryService } from './userHistory/userHistory.service';
import { ListHistoryResult } from './userHistory/userHistory.types';
import { ModifyUserInfoDto } from './users.dto';
import { UsersService } from './users.service';
import { GetUsersDetailResult } from './users.types';
import { OperateTreatisesDto } from './userFavorites/userFavorites.dto';
import { OperateTreatisesResult } from './userFavorites/userFavorites.types';
import { UserLabelsService } from './userLabels/userLabels.service';
import { OperateLabelTreatisesDto } from './userLabels/userLabels.dto';
import {
  GetNoteTreatiseDetailResult,
  ListNoteTreatiseResult,
  RemoveNoteTreatisesResult,
  SaveNoteTreatiseResult,
} from './userNotes/userNotes.types';
import { UserNotesService } from './userNotes/userNotes.service';
import {
  GetNoteTreatiseDetailDto,
  ListNoteTreatiseDto,
  RemoveNoteTreatisesDto,
  SaveNoteTreatiseDto,
} from './userNotes/userNotes.dto';

@ApiTags('我的空间-用户')
@ApiExtraModels(
  ResultData,
  GetUsersDetailResult,
  ListHistoryResult,
  SaveNoteTreatiseResult,
  RemoveNoteTreatisesResult,
  GetNoteTreatiseDetailResult,
  ListNoteTreatiseResult
)
@Controller('/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userHistoryService: UserHistoryService,
    private readonly userFavoritesService: UserFavoritesService,
    private readonly userLabelsService: UserLabelsService,
    private readonly userNotesService: UserNotesService
  ) {}

  @Get('/getUserDetail')
  @HttpCode(200)
  @ApiOperation({ summary: '获取用户详情' })
  @ApiResult(GetUsersDetailResult)
  @ApiBearerAuth()
  getUserDetail(@Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.usersService.getUserDetail(user);
  }

  @Post('/modifyUserInfo')
  @HttpCode(200)
  @ApiOperation({ summary: '编辑用户资料' })
  @ApiResult()
  @ApiBearerAuth()
  modifyUserInfo(@Body() params: ModifyUserInfoDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.usersService.modifyUserInfo(params, user);
  }

  @Get('/listHistory')
  @HttpCode(200)
  @ApiOperation({ summary: '用户浏览历史' })
  @ApiResult(ListHistoryResult)
  @ApiBearerAuth()
  listHistory(@Query() params: ListHistoryDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.userHistoryService.listHistory(params, user);
  }

  @Post('/operateFavoriteTreatises')
  @HttpCode(200)
  @ApiOperation({ summary: '收藏/移除论文' })
  @ApiResult(OperateTreatisesResult)
  @ApiBearerAuth()
  async operateTreatises(
    @Body() params: OperateTreatisesDto,
    @Req() req: any
  ): Promise<ResultData> {
    const user = <SignInResInfo>req.user;
    return this.userFavoritesService.operateTreatises(params, user);
  }

  @Post('/operateLabelTreatises')
  @HttpCode(200)
  @ApiOperation({ summary: '收藏/移除论文标签' })
  @ApiResult(OperateTreatisesResult)
  @ApiBearerAuth()
  async operateLabelTreatises(
    @Body() params: OperateLabelTreatisesDto,
    @Req() req: any
  ): Promise<ResultData> {
    const user = <SignInResInfo>req.user;
    return this.userLabelsService.operateLabelTreatises(params, user);
  }

  @Post('/saveNoteTreatise')
  @HttpCode(200)
  @ApiOperation({ summary: '添加/编辑论文笔记或用户添加评论' })
  @ApiResult(SaveNoteTreatiseResult)
  @ApiBearerAuth()
  async saveNoteTreatise(
    @Body() params: SaveNoteTreatiseDto,
    @Req() req: any
  ): Promise<ResultData> {
    const user = <SignInResInfo>req.user;
    return this.userNotesService.saveNoteTreatise(params, user);
  }

  @Post('/removeNoteTreatises')
  @HttpCode(200)
  @ApiOperation({ summary: '删除论文笔记' })
  @ApiResult(RemoveNoteTreatisesResult)
  @ApiBearerAuth()
  async removeNoteTreatises(
    @Body() params: RemoveNoteTreatisesDto,
    @Req() req: any
  ): Promise<ResultData> {
    const user = <SignInResInfo>req.user;
    return this.userNotesService.removeNoteTreatises(params, user);
  }

  @Get('/getNoteTreatiseDetail')
  @HttpCode(200)
  @ApiOperation({ summary: '获取用户笔记详情' })
  @ApiResult(GetNoteTreatiseDetailResult)
  @ApiBearerAuth()
  getNoteTreatiseDetail(@Query() params: GetNoteTreatiseDetailDto, @Req() req: any) {
    const user = <SignInResInfo>req.user;
    return this.userNotesService.getNoteTreatiseDetail(params, user);
  }

  @Get('/listNoteTreatise')
  @HttpCode(200)
  @ApiOperation({ summary: '获取笔记列表' })
  @ApiResult(ListNoteTreatiseResult)
  @ApiBearerAuth()
  listNoteTreatise(@Query() params: ListNoteTreatiseDto, @Req() req: any): Promise<ResultData> {
    const user = <SignInResInfo>req.user;
    return this.userNotesService.listNoteTreatise(params, user);
  }
}
