import { ReqListQuery } from '@/common/utils/reqListQuery';
import { PickType } from '@nestjs/swagger';

export class ListHistoryDto extends PickType(ReqListQuery, ['page', 'size'] as const) {
}
