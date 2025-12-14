import { IsNotEmpty, IsIP } from 'class-validator';

export class LookupIpDto {
  @IsNotEmpty({ message: 'IP address cannot be empty.' })
  @IsIP(4, { message: 'Please enter a valid IPv4 address.' }) 
  ip: string;
}