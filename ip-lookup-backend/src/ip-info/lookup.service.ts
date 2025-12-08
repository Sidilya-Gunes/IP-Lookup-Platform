import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IpInfo } from './ip-info.entity';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class LookupService {
  constructor(
    @InjectRepository(IpInfo)
    private repo: Repository<IpInfo>,
    private http: HttpService,
  ) {}

  async lookup(ip: string) {
    // 1-) IP format validation
    const validIp =
      /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
    if (!validIp.test(ip)) throw new BadRequestException('Invalid IP format');

    // 2-) Check DB
    const exist = await this.repo.findOne({ where: { ip_address: ip } });
    if (exist) return exist;

    // 3-) Fetch from API
    const url = `https://ipwhois.app/json/${ip}`;
    const { data } = await lastValueFrom(this.http.get(url));

    if (!data.success) throw new BadRequestException(data.message);

    // 4-) Save to DB
    const newRecord = this.repo.create({
      ip_address: ip,
      country: data.country,
      city: data.city,
      isp: data.isp,
      latitude: data.latitude,
      longitude: data.longitude,
    });

    return this.repo.save(newRecord);
  }
}
