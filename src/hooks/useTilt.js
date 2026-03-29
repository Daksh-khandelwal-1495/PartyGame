import { useState, useEffect, useRef } from 'react'

export function useTilt(onCorrect, onSkip, isActive) {
  const [permission, setPermission] = useState('unknown')
  const lastTiltRef = useRef(null) // 'up', 'down', 'neutral'
  const cooldownRef = useRef(false)

  const requestPermission = async () => {
    if (typeof DeviceOrientationEvent === 'undefined') return false
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const res = await DeviceOrientationEvent.requestPermission()
        setPermission(res)
        return res === 'granted'
      } catch (e) {
        setPermission('denied')
        return false
      }
    } else {
      setPermission('granted')
      return true
    }
  }

  useEffect(() => {
    if (!isActive || permission !== 'granted') return

    const handleMotion = (event) => {
      if (cooldownRef.current) return
      
      // Beta: front-to-back tilt (-90 to 90)
      // When phone is on forehead:
      // ~0 is neutral (screen facing forward)
      // 60+ is tilt back (looking skyward) -> SKIP
      // -60- is tilt forward (looking groundward) -> CORRECT
      const beta = event.beta

      if (beta > 65) {
        if (lastTiltRef.current !== 'up') {
          lastTiltRef.current = 'up'
          onSkip()
          triggerCooldown()
        }
      } else if (beta < -65) {
        if (lastTiltRef.current !== 'down') {
          lastTiltRef.current = 'down'
          onCorrect()
          triggerCooldown()
        }
      } else if (Math.abs(beta) < 20) {
        lastTiltRef.current = 'neutral'
      }
    }

    const triggerCooldown = () => {
      cooldownRef.current = true
      setTimeout(() => { cooldownRef.current = false }, 1000)
    }

    window.addEventListener('deviceorientation', handleMotion)
    return () => window.removeEventListener('deviceorientation', handleMotion)
  }, [isActive, permission, onCorrect, onSkip])

  return { permission, requestPermission }
}
