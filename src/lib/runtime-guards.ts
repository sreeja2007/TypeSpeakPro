/**
 * Checks if the Web Speech API Recognition is supported in the current browser.
 */
export function isSpeechRecognitionSupported(): boolean {
    return typeof window !== 'undefined' && 
        ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
}

/**
 * Checks if the Web Speech API Synthesis is supported in the current browser.
 */
export function isSpeechSynthesisSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/**
 * Checks if MediaRecorder is supported for voice recording.
 */
export function isMediaRecorderSupported(): boolean {
    return typeof window !== 'undefined' && 
        typeof navigator !== 'undefined' && 
        !!navigator.mediaDevices && 
        typeof window.MediaRecorder !== 'undefined';
}
