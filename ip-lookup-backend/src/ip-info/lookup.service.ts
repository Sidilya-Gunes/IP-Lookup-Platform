import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IpInfo } from './ip-info.entity';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LookupService {
  private readonly thirdApiUrl : string;
  constructor(
    
    @InjectRepository(IpInfo)
    private repo: Repository<IpInfo>,
    private http: HttpService,
    private configService: ConfigService,
  ) {
    this.thirdApiUrl = this.configService.get<string>('THIRD_API_URL', 'https://ipwhois.app/json/');
  }

  async lookup(ip: string) {

    //  Check DB
    const exist = await this.repo.findOne({ where: { ip_address: ip } });
    if (exist) return exist;

    //  Fetch from API
    const url = `${this.thirdApiUrl}${ip}`;
    const { data } = await lastValueFrom(this.http.get(url));

    if (!data.success) throw new BadRequestException(data.message);

    // Save to DB
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

  async getHistory() {
    return this.repo.find({
      order:{
        created_at:'DESC'
      },
      take : 20,
    });
  }
}
