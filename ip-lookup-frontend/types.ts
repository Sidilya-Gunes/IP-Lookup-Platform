
export interface IpData {
  id: number;
  ipAddress: string;
  country: string;
  city: string;
  isp: string;
  latitude: number;
  longitude: number;
  createdAt: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: boolean;
}
