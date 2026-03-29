import { Mic, MicOff } from 'lucide-react';

export default function VoiceButton({ listening, supported, onToggle }) {
  if (!supported) {
    return (
      <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <MicOff size={20} style={{ marginBottom: 4 }} />
        <div>Voice not supported in this browser</div>
      </div>
    );
  }
  return (
    <button
      className={`voice-btn${listening ? ' listening' : ''}`}
      onClick={onToggle}
      title={listening ? 'Stop listening' : 'Speak words to add them'}
    >
      {listening ? <MicOff size={26} color="white" /> : <Mic size={26} color="white" />}
    </button>
  );
}
