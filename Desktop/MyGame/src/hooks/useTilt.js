import { useState, useEffect, useRef, useCallback } from 'react';

export function useTilt(onTiltForward, onTiltBackward, enabled = true) {
  const lastTilt = useRef(null);
  const cooldown = useRef(false);
  const cooldownTimer = useRef(null);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const FORWARD_THRESHOLD = 55;
    const BACKWARD_THRESHOLD = -25;
    const COOLDOWN_MS = 750;

    const runCooldown = () => {
      cooldown.current = true;
      if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
      cooldownTimer.current = setTimeout(() => {
        cooldown.current = false;
      }, COOLDOWN_MS);
    };

    const handleTiltValue = (beta) => {
      if (typeof beta !== 'number' || Number.isNaN(beta)) return;
      if (cooldown.current) {
        lastTilt.current = beta;
        return;
      }

      const previous = lastTilt.current;
      if (previous === null) {
        lastTilt.current = beta;
        return;
      }

      // Tilt forward (phone faces floor) => correct
      if (beta > FORWARD_THRESHOLD && previous <= FORWARD_THRESHOLD) {
        lastTilt.current = beta;
        runCooldown();
        onTiltForward?.();
        return;
      }

      // Tilt backward (phone faces ceiling) => skip
      if (beta < BACKWARD_THRESHOLD && previous >= BACKWARD_THRESHOLD) {
        lastTilt.current = beta;
        runCooldown();
        onTiltBackward?.();
        return;
      }

      lastTilt.current = beta;
    };

    const handleOrientation = (e) => {
      handleTiltValue(e.beta);
    };

    window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
    };
  }, [onTiltForward, onTiltBackward, enabled]);

  // Request permission on iOS 13+
  const requestPermission = useCallback(async () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const result = await DeviceOrientationEvent.requestPermission();
        return result === 'granted';
      } catch {
        return false;
      }
    }

    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const result = await DeviceMotionEvent.requestPermission();
        return result === 'granted';
      } catch {
        return false;
      }
    }

    return true;
  }, []);

  return { requestPermission };
}
