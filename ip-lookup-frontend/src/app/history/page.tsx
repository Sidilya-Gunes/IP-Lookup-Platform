"use client";

import React, { useState, useEffect } from "react";
import IpHistoryList from '@/components/IpHistoryList';

export default function HistoryPage(){
    const [isDemoMode, setIsDemoMode] = useState(false);

    useEffect(() => {
        const savedMode = localStorage.getItem('netintel_demo_mode');
        if (savedMode === 'true') setIsDemoMode(true);
    }, []);

    return(
        <main className="min-h-screen bg-gray-100 p-4">
        <IpHistoryList refreshTrigger={0} isDemoMode={isDemoMode} />
        </main>
    )
}