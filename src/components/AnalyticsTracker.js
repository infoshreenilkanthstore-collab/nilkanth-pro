'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

function getDeviceType() {
  if (typeof window === 'undefined') return 'desktop';
  const ua = navigator.userAgent || '';
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
    return 'mobile';
  }
  if (window.innerWidth < 768) {
    return 'mobile';
  }
  if (window.innerWidth <= 1024) {
    return 'tablet';
  }
  return 'desktop';
}

function getSessionId() {
  if (typeof window === 'undefined') return '';
  try {
    let sessionId = sessionStorage.getItem('shop_session_id');
    if (!sessionId) {
      sessionId = 'sess_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now().toString(36);
      sessionStorage.setItem('shop_session_id', sessionId);
    }
    return sessionId;
  } catch (e) {
    return 'sess_' + Math.random().toString(36).substring(2, 15);
  }
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const currentPathRef = useRef(pathname);

  useEffect(() => {
    currentPathRef.current = pathname;
  }, [pathname]);

  const sendPing = async (currentPath) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_SHOPFRONT_API_URL || 'https://megaecomm.megascale.co.in/backend';
      const token = process.env.NEXT_PUBLIC_SHOPFRONT_TOKEN || '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d3690e704f526300';
      const sessionId = getSessionId();
      const deviceType = getDeviceType();
      const pathToSend = currentPath || currentPathRef.current || (typeof window !== 'undefined' ? window.location.pathname : '/');

      await fetch(`${apiUrl}/api/shop/analytics/ping`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopfront-Token': token,
        },
        body: JSON.stringify({
          session_id: sessionId,
          path: pathToSend,
          device_type: deviceType,
        }),
      });
    } catch (error) {
      // Fail silently to avoid breaking UX
      console.debug('[Analytics] Ping error:', error);
    }
  };

  const isFirstRender = useRef(true);

  // 1. Send ping on initial page visit and whenever pathname changes
  // Also notify Meta Pixel of virtual PageView on SPA route change
  useEffect(() => {
    if (pathname) {
      sendPing(pathname);

      if (isFirstRender.current) {
        isFirstRender.current = false;
      } else {
        if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
          window.fbq('track', 'PageView');
          console.log('🎯 [Meta Pixel] Tracked PageView on route change:', pathname);
        }
      }
    }
  }, [pathname]);

  // 2. Heartbeat interval every 2.5 minutes (150,000 ms) for live visitor tracking
  useEffect(() => {
    const HEARTBEAT_INTERVAL_MS = 2.5 * 60 * 1000; // 2.5 minutes

    const intervalId = setInterval(() => {
      sendPing(currentPathRef.current);
    }, HEARTBEAT_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, []);

  // 3. 🚀 Instant removal from live tracking when visitor closes the tab/browser
  useEffect(() => {
    const handleLeave = () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_SHOPFRONT_API_URL || 'https://megaecomm.megascale.co.in/backend';
        const token = process.env.NEXT_PUBLIC_SHOPFRONT_TOKEN || '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d3690e704f526300';
        const sessionId = getSessionId();

        const payload = JSON.stringify({
          session_id: sessionId,
          action: 'leave',
        });

        const blob = new Blob([payload], { type: 'application/json' });
        // sendBeacon delivers reliably even as the window/tab is closing
        const url = `${apiUrl}/api/shop/analytics/ping?store_token=${token}`;
        navigator.sendBeacon(url, blob);
      } catch (err) {
        console.debug('[Analytics] Leave beacon error:', err);
      }
    };

    window.addEventListener('beforeunload', handleLeave);
    window.addEventListener('pagehide', handleLeave);

    return () => {
      window.removeEventListener('beforeunload', handleLeave);
      window.removeEventListener('pagehide', handleLeave);
    };
  }, []);

  return null;
}
