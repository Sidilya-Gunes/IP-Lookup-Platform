export class IpInfoResponseDto {
  id: number;
  ipAddress: string;
  country: string;
  city: string;
  isp: string;
  latitude: number;
  longitude: number;
  createdAt: Date;
}