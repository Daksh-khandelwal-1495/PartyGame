import { useState, useEffect, useRef } from 'react';

export type TiltDirection = 'none' | 'correct' | 'skip';

/**
 * Returns the current tilt direction based on device orientation.
 * - Tilt forward (beta < -20)  → 'correct'
 * - Tilt backward (beta > 20)  → 'skip'
 * - Otherwise                  → 'none'
 */
export function useDeviceOrientation(enabled: boolean): TiltDirection {
  const [direction, setDirection] = useState<TiltDirection>('none');
  const cooldown = useRef(false);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;
    if (!window.DeviceOrientationEvent) return;

    function handler(e: DeviceOrientationEvent) {
      if (cooldown.current) return;
      const beta = e.beta ?? 0; // front-back tilt
      if (beta < -20) {
        setDirection('correct');
        cooldown.current = true;
        setTimeout(() => { cooldown.current = false; setDirection('none'); }, 1200);
      } else if (beta > 20) {
        setDirection('skip');
        cooldown.current = true;
        setTimeout(() => { cooldown.current = false; setDirection('none'); }, 1200);
      }
    }

    window.addEventListener('deviceorientation', handler, true);
    return () => window.removeEventListener('deviceorientation', handler, true);
  }, [enabled]);

  return direction;
}
