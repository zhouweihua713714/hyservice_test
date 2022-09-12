import { ApiResult } from '@/common/decorators/apiResult.decorator';
import { ResultData } from '@/common/utils/result';
import { Body, Controller, Get, HttpCode, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AllowAnon } from '../../common/decorators/allowAnon.decorator';
import { SignInResInfo } from '../auth/auth.types';
import { ModifyUserInfoDto } from './users.dto';
import { UsersService } from './users.service';
import { GetUsersDetailResult } from './users.types';

@ApiTags('我的空间-用户')
@ApiExtraModels(ResultData, GetUsersDetailResult)
@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
}
