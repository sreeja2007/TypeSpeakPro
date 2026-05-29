import { useState, useRef, useCallback, useEffect } from 'react';
import { isMediaRecorderSupported, isSpeechRecognitionSupported } from '@/lib/runtime-guards';

interface UseVoiceRecorderProps {
  maxDuration?: number; // in seconds
  onRecordingComplete?: (blob: Blob, transcript: string) => void;
  onTimeUpdate?: (timeRemaining: number) => void;
}

interface UseVoiceRecorderReturn {
  isRecording: boolean;
  isPaused: boolean;
  timeRemaining: number;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  audioBlob: Blob | null;
  error: string | null;
  hasPermission: boolean | null;
}

// Extend global window object for webkitSpeechRecognition
declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

/**
 * Maps microphone/media errors to user-friendly messages.
 */
function mapMediaError(err: unknown): string {
  if (err instanceof DOMException) {
    switch (err.name) {
      case 'NotAllowedError':
        return 'Microphone access was denied. Please allow microphone permission in your browser settings.';
      case 'NotFoundError':
        return 'No microphone was found. Please connect a microphone and try again.';
      case 'NotReadableError':
        return 'Your microphone is currently in use by another application.';
      case 'OverconstrainedError':
        return 'Microphone does not meet the required constraints.';
      case 'AbortError':
        return 'Microphone access was interrupted. Please try again.';
      default:
        return `Microphone error: ${err.message}`;
    }
  }
  if (err instanceof Error) {
    return err.message;
  }
  return 'Failed to access microphone.';
}

export const useVoiceRecorder = ({
  maxDuration = 60,
  onRecordingComplete,
  onTimeUpdate,
}: UseVoiceRecorderProps = {}): UseVoiceRecorderReturn & { transcript: string } => { // Add transcript to return type
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(maxDuration);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [transcript, setTranscript] = useState(''); // Add transcript state
  const transcriptRef = useRef(''); // Ref to hold latest transcript without causing re-renders in closure
  const savedCallback = useRef(onRecordingComplete); // Ref for saved callback to avoid stale closures

  // Update saved callback
  useEffect(() => {
    savedCallback.current = onRecordingComplete;
  }, [onRecordingComplete]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null); // Speech recognition ref
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stopRecording = useCallback(() => {
    clearTimer();

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore error if already stopped
      }
      recognitionRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    setIsRecording(false);
    setIsPaused(false);
  }, [clearTimer]);

  // Cleanup on unmount — stop all media tracks, timers, and recognition
  useEffect(() => {
    return () => {
      clearTimer();

      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch { /* already stopped */ }
        recognitionRef.current = null;
      }

      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try { mediaRecorderRef.current.stop(); } catch { /* already stopped */ }
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [clearTimer]);

  const startRecording = useCallback(async () => {
    // Runtime capability check
    if (!isMediaRecorderSupported()) {
      setError('Audio recording is not supported in this browser. Please use a modern browser like Chrome or Edge.');
      return;
    }

    // Prevent duplicate recording sessions
    if (isRecording) {
      console.warn('Recording is already in progress.');
      return;
    }

    try {
      setError(null);
      setAudioBlob(null);
      setTranscript(''); // Reset transcript
      transcriptRef.current = '';
      audioChunksRef.current = [];
      setTimeRemaining(maxDuration);

      // 1. Get Audio Stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      setHasPermission(true);
      streamRef.current = stream;

      // 2. Setup MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4',
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        // Use savedCallback to ensure we access the latest closure context (including fresh state from parent)
        if (savedCallback.current) {
          savedCallback.current(blob, transcriptRef.current);
        }
      };

      mediaRecorder.start(100);

      // 3. Setup Speech Recognition (Web Speech API)
      if (isSpeechRecognitionSupported()) {
        // Abort any previous recognition session to prevent duplicates
        if (recognitionRef.current) {
          try { recognitionRef.current.abort(); } catch { /* already stopped */ }
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          // Re-construct the full transcript from all results
          for (let i = 0; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
          transcriptRef.current = currentTranscript; // Update ref
        };

        recognition.onerror = (event: any) => {
          // Don't treat 'no-speech' as a fatal error — it auto-recovers
          if (event.error !== 'no-speech' && event.error !== 'aborted') {
            console.warn("Speech recognition error:", event.error);
          }
        };

        recognition.start();
        recognitionRef.current = recognition;
      } else {
        console.warn("Web Speech API not supported in this browser. Transcription will not be available.");
      }

      setIsRecording(true);

      // 4. Start Timer
      let remaining = maxDuration;
      timerRef.current = setInterval(() => {
        remaining -= 1;
        setTimeRemaining(remaining);
        onTimeUpdate?.(remaining);

        if (remaining <= 0) {
          stopRecording();
        }
      }, 1000);

    } catch (err) {
      setHasPermission(false);
      setError(mapMediaError(err));
      console.error('Error accessing microphone:', err);
    }
  }, [maxDuration, isRecording, onRecordingComplete, onTimeUpdate, stopRecording]);

  return {
    isRecording,
    isPaused,
    timeRemaining,
    startRecording,
    stopRecording,
    audioBlob,
    error,
    hasPermission,
    transcript, // Return transcript
  };
};
