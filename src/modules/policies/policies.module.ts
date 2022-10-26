import { Module } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AnalysisPoliciesModule } from './analysisPolicies/analysisPolicies.module';
import { PoliciesController } from './policies.controller';
import { PoliciesService } from './policies.service';

@Module({
  imports: [AnalysisPoliciesModule, UsersService],
  controllers: [PoliciesController],
  providers: [PoliciesService, UsersService],
  exports: [PoliciesService, UsersService],
})
export class PoliciesModule {}
