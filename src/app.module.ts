import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module';
import { ConfigurationModule } from 'config/config.module';
import { ConfigModule } from '@nestjs/config';
import { AccountsModule } from './logic/backoffice/accounts/accounts.module';
import { Accounts } from './logic/backoffice/accounts/entities/accounts.entity';
import { VerificationModule } from './logic/business/verification/verification.module';
import { Verification } from './models/verification.entity';

@Module({
  imports: [
    ConfigurationModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env'}),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT, 10),
      password: process.env.POSTGRES_PASSWORD,
      username: 'postgres',
      entities: [Accounts, Verification],
      database: process.env.POSTGRES_DATABASE,
      synchronize: true,
      logging: true
    }),
    ConfigModule.forRoot(),
    AuthModule,
    AccountsModule,
    VerificationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
