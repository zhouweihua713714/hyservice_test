import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiExtraModels, ApiBearerAuth } from '@nestjs/swagger';

import { ResultData } from '../../common/utils/result';
import { AllowAnon } from '../../common/decorators/allowAnon.decorator';
import { ApiResult } from '../../common/decorators/apiResult.decorator';
import { signInResInfo, signUpResInfo } from '@/modules/auth/auth.types';
import { GenCodeDto, ModifyPasswordDto, ResetPasswordDto, signInDto, signUpDto } from './auth.dto';
import { AuthService } from './auth.service';

@ApiTags('登录注册')
@ApiExtraModels(ResultData, signInResInfo, signUpResInfo)
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign_in')
  @HttpCode(200)
  @ApiOperation({ summary: '用户登录' })
  @ApiResult(signInResInfo)
  @AllowAnon()
  async signIn(@Body() params: signInDto): Promise<ResultData> {
    return this.authService.signIn(params);
  }
  @Post('/sign_up')
  @HttpCode(200)
  @ApiOperation({ summary: '用户注册' })
  @ApiResult(signUpResInfo)
  @AllowAnon()
  async signUp(@Body() params: signUpDto): Promise<ResultData> {
    return this.authService.signUp(params);
  }
  @Post('/modify_password')
  @HttpCode(200)
  @ApiOperation({ summary: '修改密码' })
  @ApiResult()
  @ApiBearerAuth()
  modifyPassword(@Body() params: ModifyPasswordDto): Promise<ResultData> {
    return this.authService.modifyPassword(params);
  }
  @Post('/reset_password')
  @HttpCode(200)
  @ApiOperation({ summary: '重置密码' })
  @ApiResult()
  @AllowAnon()
  resetPassword(@Body() params: ResetPasswordDto): Promise<ResultData> {
    return this.authService.resetPassword(params);
  }
  @Post('/gen_code')
  @HttpCode(200)
  @ApiOperation({ summary: '发送验证码' })
  @ApiResult()
  @AllowAnon()
  async genCode(@Body() params: GenCodeDto): Promise<ResultData> {
    return this.authService.genCode(params);
  }
}
