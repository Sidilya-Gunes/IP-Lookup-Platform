import { Controller, Post, Body, Get } from '@nestjs/common';
import { LookupService } from './lookup.service';
import { LookupIpDto } from './dto/LookupIpData';

@Controller('lookup')
export class LookupController {
  constructor(private readonly lookupService: LookupService) {}

  @Post()
  async lookupIp(@Body() lookupIpDto: LookupIpDto) {
    return this.lookupService.lookup(lookupIpDto.ip);
  }

  @Get('history')
  async getIpHistory(){
    return this.lookupService.getHistory();
    }
}
