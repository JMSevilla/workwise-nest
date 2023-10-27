import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationController } from './verification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Verification } from 'src/models/verification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Verification])],
  controllers: [VerificationController],
  providers: [VerificationService],
})
export class VerificationModule {}
