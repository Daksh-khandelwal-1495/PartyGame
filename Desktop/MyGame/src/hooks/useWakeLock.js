import { useEffect, useRef } from 'react';

export function useWakeLock(enabled) {
  const wakeLockRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const requestWakeLock = async () => {
      if (!enabled) return;
      if (!('wakeLock' in navigator)) return;

      try {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
      } catch {
        // Unsupported or denied: fail silently
      }
    };

    const releaseWakeLock = async () => {
      try {
        await wakeLockRef.current?.release();
      } catch {
        // ignore release errors
      } finally {
        wakeLockRef.current = null;
      }
    };

    const handleVisibility = async () => {
      if (!mounted) return;
      if (document.visibilityState === 'visible' && enabled) {
        await requestWakeLock();
      } else {
        await releaseWakeLock();
      }
    };

    requestWakeLock();
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      mounted = false;
      document.removeEventListener('visibilitychange', handleVisibility);
      releaseWakeLock();
    };
  }, [enabled]);
}
