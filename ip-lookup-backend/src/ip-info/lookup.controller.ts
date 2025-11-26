import { Controller, Post, Body } from '@nestjs/common';
import { LookupService } from './lookup.service';

@Controller('lookup')
export class LookupController {
  constructor(private readonly lookupService: LookupService) {}

  @Post()
  async lookupIp(@Body('ip') ip: string) {
    return this.lookupService.lookup(ip);
  }
}
