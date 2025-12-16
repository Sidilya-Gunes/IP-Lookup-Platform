import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { LookupService } from './lookup.service';
import { LookupIpDto } from './dto/LookupIpData';

@Controller('lookup')
export class LookupController {
  constructor(private readonly lookupService: LookupService) {}

  @Post()
  async lookupIp(@Body() lookupIpDto: LookupIpDto) {
    return this.lookupService.lookup(lookupIpDto.ip);
  }

  @Get('')
  async getIpHistory(){
    try{
      // generate error
      return this.lookupService.getHistory();

    }catch(error){
      throw error;
    }
    }

    @Get(":ip")
    async getIpInfo(@Param('ip') ip: string) {
      return this.lookupService.get_one(ip);
    }
}
