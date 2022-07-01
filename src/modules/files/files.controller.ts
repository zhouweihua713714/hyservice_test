import { AllowAnon } from '@/common/decorators/allowAnon.decorator';
import { ApiResult } from '@/common/decorators/apiResult.decorator';
import { ResultData } from '@/common/utils/result';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Redirect,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { AccessDto, LaunchDto } from './oss/oss.dto';
import { OSSService } from './oss/oss.service';
import { XlsxService } from './xlsx/xlsx.service';
import { LaunchResult } from './oss/oss.types';

@ApiTags('文件上传')
@ApiExtraModels(
  ResultData,
  LaunchResult,
)
@Controller('/file')
export class FilesController {
  constructor(private readonly filesService: FilesService, private readonly oss: OSSService,private readonly xlsx:XlsxService) {}

  // 一下三个为 oss 接口
  @Post('/launch')
  @HttpCode(200)
  @ApiOperation({ summary: '客户端预上传接口' })
  @ApiResult(LaunchResult)
  @AllowAnon() // 手动校验
  @ApiBearerAuth()
  launch(@Body() params: LaunchDto, @Req() req: any): Promise<ResultData> {
    return this.oss.launch(params, req);
  }

  @Get('/access')
  @Redirect()
  @ApiOperation({ summary: '预览图片' })
  @ApiResult()
  @AllowAnon()
  access(@Query() params: AccessDto) {
    return this.oss.access(params);
  }

  @Post('/callback')
  @HttpCode(200)
  @AllowAnon()
  callback(@Body() params: any, @Req() req: any): Promise<Record<string, any>> {
    return this.oss.callback(params, req);
  }

  @Post('/parseXlsx')
  @HttpCode(200)
  @AllowAnon()
  parseXlsx(@Body() params: any, @Req() req: any): Promise<Record<string, any>> {
    return this.xlsx.parseXlsx(params, req);
  }
}
