import { Codes } from '@/entities/Codes.entity';
import { Files } from '@/entities/Files.entity';
import { Logins } from '@/entities/Logins.entity';
import { Users } from '@/entities/Users.entity';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthStrategy } from './auth.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      Logins,
      Codes,
      Files,
    ]),
    // jwt
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('jwt.secretKey'),
        // signOptions: {
        //   expiresIn: config.get('jwt.expiresIn'),
        // },
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthController],
  providers: [AuthStrategy, AuthService],
  exports: [TypeOrmModule, PassportModule, AuthService, JwtModule],
})
export class AuthModule {}
