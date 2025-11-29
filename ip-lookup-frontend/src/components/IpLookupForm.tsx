'use client';

import React, {useState, useCallback} from 'react';
import axios from 'axios';

interface IpData{
  id: number;
  ipAddress: string;
  country: string;
  city: string;
  isp: string;
  latitude: number;
  longitude: number;
  createdAt: string;
}

const IpLookupForm : React.FC = ()=>{
  const [ip,setIp]=useState('');
  const [loading , setLoading] =useState(false);
  const [error,setError]=useState<string | null>(null);
  const [ipData,setIpData]=useState<IpData | null>(null);

  const BASE_URL = 'http://localhost:3000';
  const LOOKUP_ENDPOINT = `${BASE_URL}/lookup`;

  const handleSubmit= useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading (true);
    setError(null);
    setIpData(null);

    try{
      const response = await axios.post<IpData>(LOOKUP_ENDPOINT, {ip});

      setIpData(response.data);

    }catch(err:any){

      const errorMessage = err.response?.data?.message || 'Sorgulama başarısız oldu. Lütfen IP adresini ve sunucu durumunu kontrol edin.';
      setError(errorMessage);

    }finally{

      setLoading(false);

    }
  
  },[ip]);

return(

<div className="max-w-xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">🌍 IP Adresi Sorgulama</h2>
      
      {/* Input Formu */}
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          placeholder="Örn: 8.8.8.8"
          disabled={loading}
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-gray-900"
        />
        <button
          type="submit"
          disabled={loading}
          className="p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition duration-150"
        >
          {loading ? 'Sorgulanıyor...' : 'Sorgula'}
        </button>
      </form>

      {/* Hata Mesajı */}
      {error && (
        <div className="p-4 mb-4 text-sm text-red-800 bg-red-100 rounded-lg" role="alert">
          <span className="font-medium">Hata:</span> {error}
        </div>
      )}

      {/* 3.4 IP Bilgisi Gösterimi */}
      {ipData && <IpInfoCard data={ipData} />}
    </div>
  );
};

// IP Bilgisi Card Bileşeni
const IpInfoCard: React.FC<{ data: IpData }> = ({ data }) => {
  const info = [
    { label: 'IP Adresi', value: data.ipAddress },
    { label: 'Ülke', value: data.country || 'Bilinmiyor' },
    { label: 'Şehir', value: data.city || 'Bilinmiyor' },
    { label: 'ISP', value: data.isp || 'Bilinmiyor' },
    { label: 'Koordinatlar', value: `${data.latitude}, ${data.longitude}` },
    { label: 'Kayıt Tarihi', value: new Date(data.createdAt).toLocaleDateString() },
  ];

  return (
    <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 mt-6">
      <h3 className="text-xl font-bold mb-4 text-blue-600">✅ Sorgu Sonucu</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        {info.map((item, index) => (
          <div key={index} className="flex flex-col">
            <span className="text-xs font-medium text-gray-500 uppercase">{item.label}</span>
            <span className="text-base font-semibold text-gray-800">{item.value}</span>
          </div>
        ))}
      </div>
    </div>

)

}

export default IpLookupForm;