"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

interface IpData {
  id: number;
  ipAddress: string;
  country: string;
  city: string;
  isp: string;
  latitude: number;
  longitude: number;
  createdAt: string;
}

const IpHistoryList: React.FC = () => {

    const [history, setHistory]=useState<IpData[]>([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState<string | null>(null)

    const BASE_URL = "http://localhost:3000";
    const HISTORY_ENDPOINT = `${BASE_URL}/lookup/history`;

    useEffect(()=>{
      const fetchHistory = async()=> {
        try {
          const response = await axios.get<IpData[]>(HISTORY_ENDPOINT);
          setHistory(response.data);
        }catch(err){
          setError('Geçmiş verileri yüklenirken bir sorun oluştu.');
        }finally{
          setLoading(false);
        }
      };

      fetchHistory();

    },[]);


    if(loading){
      return <div className="text-center p-8">Geçmiş yükleniyor...</div>;
    }

    if(error){
      return <div className="text-center p-8 text-red-600 font-semibold">{error}</div>;
    }

    if(history.length === 0){
      return <div className="text-center p-8 text-gray-500">Henüz sorgulanmış bir IP adresi yok.</div>
    }

    return(
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-lg mt-8">
            <h2 className="text-3xl font-bold mb-6 text-blue-800 border-b pb-2">📜 Sorgu Geçmişi ({history.length} Kayıt)</h2>
            
            <div className="space-y-4">
              {history.map((item) => (
                <div key={item.id} className="p-4 border border-gray-200 rounded-lg transition hover:shadow-md">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xl font-extrabold text-gray-900">{item.ipAddress}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-gray-700">
                    <p>📍 {item.city || 'Bilinmiyor'} / {item.country || 'Bilinmiyor'}</p>
                    <p>🌐 Sağlayıcı: {item.isp || 'Bilinmiyor'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
    )
};

export default IpHistoryList;