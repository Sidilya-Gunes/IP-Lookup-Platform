import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IpInfo } from './ip-info.entity';
import { LookupService } from './lookup.service';
import { LookupController } from './lookup.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([IpInfo]), HttpModule],
  providers: [LookupService],
  controllers: [LookupController],
})
export class IpInfoModule {}
