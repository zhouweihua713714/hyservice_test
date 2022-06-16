import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AllowAnon } from '../../common/decorators/allowAnon.decorator';

@ApiTags('健康检查')
@Controller('/')
export class HomeController {
  @Get('/healthy')
  @HttpCode(200)
  @ApiOperation({ summary: '健康检查判断' })
  @AllowAnon()
  signIn(): string {
    return 'healthy';
  }
}
