import { Controller, UseGuards, Body, Get, Query, Post, Put } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { useResponse } from 'src/utils/hook/useCreateResponse';
import { CreateAccountDto } from './dto/create-account.dto';
import { VerificationDto } from 'src/utils/schemas/verification.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}


  @Get('check-accounts')
  async _checkAccountsBackOffice(){
    const result = await this.accountsService._checkAccountExistency()
    return { data: result };
  }

  @Put('check')
  async _checkAccountsEmail(
    @Query('email') email: string
  ){
    const result = await this.accountsService._check_email(email)
    return {
      data: result
    }
  }

  @Post('account-creation')
  async create_account(@Body() body: CreateAccountDto) {
    const result = await this.accountsService.__create__accountsetup(body)
    return result;
  }

  @Post('create-verification')
  async createVerification(@Body() body: VerificationDto) {
    const result = await this.accountsService.createVerification(body)
    return result;
  }
}
