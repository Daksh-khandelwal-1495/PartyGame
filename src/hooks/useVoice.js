import { useState, useRef, useEffect } from 'react'

export function useVoice(onTranscript) {
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef(null)

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) return
    
    recognitionRef.current = new webkitSpeechRecognition()
    recognitionRef.current.continuous = true
    recognitionRef.current.interimResults = false
    recognitionRef.current.lang = 'en-US'

    recognitionRef.current.onresult = (event) => {
      const text = event.results[event.results.length - 1][0].transcript
      onTranscript(text)
    }

    recognitionRef.current.onend = () => setIsListening(false)
  }, [onTranscript])

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  return { isListening, toggleListen }
}
