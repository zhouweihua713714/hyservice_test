import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logins } from '@/entities/Logins.entity';
import { Users } from '@/entities/Users.entity';
import { UsersDao } from './users.dao';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      Logins,
    ]),

  ],
  providers: [UsersDao],
  exports: [UsersDao],
})
export class DaoModule {}
