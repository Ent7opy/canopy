'use client';
import { useEffect, useState } from 'react';
import { getDashboard, type ApiDashboard } from '@/lib/api';

export function useDashboard() {
  const [data, setData] = useState<ApiDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);

  return { dashboard: data, loading };
}
