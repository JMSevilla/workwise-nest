import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport'
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { RefreshTokenIdsStorage } from './refresh-token-ids-storage';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtRefreshTokenStrategy } from './strategy/jwt-token-refresh.strategy';
import { AccountsModule } from 'src/logic/backoffice/accounts/accounts.module';
import { Accounts } from 'src/logic/backoffice/accounts/entities/accounts.entity';
import { AccountsService } from 'src/logic/backoffice/accounts/accounts.service';
import { Verification } from 'src/models/verification.entity';
import { VerificationService } from 'src/logic/business/verification/verification.service';

@Module({
  imports: [
    AccountsModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Accounts, Verification]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '1h' },
    })
  ],
  providers: [
    AuthService,
    JwtStrategy,
    AccountsService,
    VerificationService,
    RefreshTokenIdsStorage,
    LocalStrategy,
    JwtRefreshTokenStrategy
  ],
  exports: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
