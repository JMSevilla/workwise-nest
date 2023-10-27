import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accounts } from './entities/accounts.entity';
import { Verification } from 'src/models/verification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Accounts, Verification])],
  controllers: [AccountsController],
  providers: [AccountsService],
})
export class AccountsModule {}
