import { Website } from '@/entities/Website.entity';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';

export class GetTermsConfigResult extends PickType(Website, [
  'id',
  'name',
  'IPC',
  'CDN',
  'versionNo',
  'blacklist',
  'title',
  'description',
  'ownership',
  'bottomDescription',
  'links',
  'logo',
  'qrCode',
] as const) {}
