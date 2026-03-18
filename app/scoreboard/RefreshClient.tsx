'use client'
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RefreshClient() {
  const router = useRouter();
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 10000); // 10 seconds auto-refresh
    return () => clearInterval(interval);
  }, [router]);
  return null;
}
