import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logins } from '@/entities/Logins.entity';
import { Users } from '@/entities/Users.entity';
import { Codes } from '@/entities/Codes.entity';
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
