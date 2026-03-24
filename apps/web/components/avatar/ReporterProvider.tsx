'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useI18n } from '@/i18n';

// ─── ElevenLabs Config ───
const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || '';
const ELEVENLABS_VOICE_ID = process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL';

// ─── Global TTS Context ───
interface ReporterContextType {
  speakText: (text: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
  mouthOpenness: number; // 0 to 1
}

const ReporterContext = createContext<ReporterContextType>({
  speakText: () => {},
  stopSpeaking: () => {},
  isSpeaking: false,
  mouthOpenness: 0,
});

export const useReporter = () => useContext(ReporterContext);

type MouthLevel = 0 | 1 | 2 | 3;

export function ReporterProvider({ children }: { children: React.ReactNode }) {
  const { lang } = useI18n();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mouthLevel, setMouthLevel] = useState<MouthLevel>(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const prevLevelRef = useRef<MouthLevel>(0);

  // ─── Improved multi-level lip sync ───
  const startLipSync = useCallback((audio: HTMLAudioElement) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
      const ctx = audioContextRef.current;
      if (!sourceRef.current) {
        sourceRef.current = ctx.createMediaElementSource(audio);
      }

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.4;
      analyserRef.current = analyser;

      sourceRef.current.connect(analyser);
      analyser.connect(ctx.destination);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const tick = () => {
        analyser.getByteFrequencyData(dataArray);

        // Voice frequency bins (roughly 80Hz-800Hz)
        let sum = 0;
        const start = 2;
        const end = Math.min(60, dataArray.length);
        for (let i = start; i < end; i++) {
          sum += dataArray[i];
        }
        const avgVol = sum / (end - start);

        // 4-level mouth state
        let newLevel: MouthLevel = 0;
        if (avgVol > 90) newLevel = 3;
        else if (avgVol > 55) newLevel = 2;
        else if (avgVol > 25) newLevel = 1;
        else newLevel = 0;

        if (newLevel !== prevLevelRef.current) {
          prevLevelRef.current = newLevel;
          setMouthLevel(newLevel);
        }

        animationFrameRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch (e) {
      console.error('Lip sync error:', e);
    }
  }, []);

  const stopLipSync = useCallback(() => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (analyserRef.current && sourceRef.current) {
      try { sourceRef.current.disconnect(analyserRef.current); } catch (_) {}
    }
    prevLevelRef.current = 0;
    setMouthLevel(0);
    setIsSpeaking(false);
  }, []);

  // ─── Core speak function ───
  const speakText = useCallback(
    async (text: string) => {
      // Stop any current speech first
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      window.speechSynthesis?.cancel();

      if (ELEVENLABS_API_KEY) {
        try {
          setIsSpeaking(true);
          const response = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
            {
              method: 'POST',
              headers: {
                'xi-api-key': ELEVENLABS_API_KEY,
                'Content-Type': 'application/json',
                Accept: 'audio/mpeg',
              },
              body: JSON.stringify({
                text: text.substring(0, 2500),
                model_id: 'eleven_multilingual_v2',
                voice_settings: {
                  stability: 0.6,
                  similarity_boost: 0.85,
                  style: 0.3,
                  use_speaker_boost: true,
                },
              }),
            }
          );
          if (!response.ok) throw new Error('ElevenLabs error');

          const audioBlob = await response.blob();
          const audioUrl = URL.createObjectURL(audioBlob);

          if (!audioRef.current) {
            audioRef.current = new Audio();
            audioRef.current.crossOrigin = 'anonymous';
          }
          const audio = audioRef.current;
          audio.src = audioUrl;
          audio.onplay = () => startLipSync(audio);
          audio.onended = () => { stopLipSync(); URL.revokeObjectURL(audioUrl); };
          audio.onerror = () => { stopLipSync(); URL.revokeObjectURL(audioUrl); };
          await audio.play();
          return;
        } catch (err) {
          console.warn('ElevenLabs failed, falling back to browser TTS');
        }
      }

      // Browser fallback
      if (!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      setIsSpeaking(true);

      const utterance = new SpeechSynthesisUtterance(text);
      const langMap: Record<string, string> = { en: 'en-US', si: 'si-LK', ta: 'ta-LK' };
      utterance.lang = langMap[lang] || 'en-US';
      utterance.rate = 0.95;

      let mouthAnimId: ReturnType<typeof setInterval>;
      let frameCount = 0;
      utterance.onstart = () => {
        mouthAnimId = setInterval(() => {
          frameCount++;
          const patterns: MouthLevel[] = [0, 2, 3, 1, 3, 2, 0, 1, 2, 3, 1, 0];
          setMouthLevel(patterns[frameCount % patterns.length]);
        }, 80);
      };

      utterance.onend = () => {
        clearInterval(mouthAnimId);
        setIsSpeaking(false);
        setMouthLevel(0);
      };
      utterance.onerror = () => {
        clearInterval(mouthAnimId);
        setIsSpeaking(false);
        setMouthLevel(0);
      };

      window.speechSynthesis.speak(utterance);
    },
    [lang, startLipSync, stopLipSync]
  );

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    window.speechSynthesis?.cancel();
    stopLipSync();
  }, [stopLipSync]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
      audioContextRef.current?.close();
      window.speechSynthesis?.cancel();
    };
  }, []);

  const mouthOpenness = mouthLevel / 3;

  return (
    <ReporterContext.Provider value={{ speakText, stopSpeaking, isSpeaking, mouthOpenness }}>
      {children}
    </ReporterContext.Provider>
  );
}
