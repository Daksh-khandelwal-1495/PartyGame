import { useState, useEffect } from 'react';
import type { Settings } from '../types';

const STORAGE_KEY = 'mygame_settings';

const DEFAULT_SETTINGS: Settings = {
  timerSecs: 60,
  rounds: 3,
  soundEnabled: true,
  tiltEnabled: true,
  largeText: false,
  highContrast: false,
};

function load(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {/* ignore */}
  return DEFAULT_SETTINGS;
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    // apply body classes
    document.body.classList.toggle('large-text',   settings.largeText);
    document.body.classList.toggle('high-contrast', settings.highContrast);
  }, [settings]);

  function update(patch: Partial<Settings>) {
    setSettings(s => ({ ...s, ...patch }));
  }

  return { settings, update };
}
