import React, { createContext, useContext, useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { useI18n } from '../../i18n';

interface ReporterContextType {
  isSpeaking: boolean;
  mouthOpenness: number;
  speakText: (text: string) => Promise<void>;
  stopSpeaking: () => void;
}

const ReporterContext = createContext<ReporterContextType>({
  isSpeaking: false,
  mouthOpenness: 0,
  speakText: async () => {},
  stopSpeaking: () => {},
});

export function ReporterProvider({ children }: { children: React.ReactNode }) {
  const { lang } = useI18n();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mouthOpenness, setMouthOpenness] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSpeaking) {
      interval = setInterval(() => {
        setMouthOpenness(Math.random() > 0.3 ? 1 : 0);
      }, 150);
    } else {
      setMouthOpenness(0);
    }
    return () => clearInterval(interval);
  }, [isSpeaking]);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const speakText = async (text: string) => {
    stopSpeaking();
    setIsSpeaking(true);

    const key = process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY;
    if (key) {
      try {
        const response = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL?output_format=mp3_44100_128`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'xi-api-key': key,
            },
            body: JSON.stringify({
              text,
              model_id: 'eleven_multilingual_v2',
            }),
          }
        );

        if (!response.ok) throw new Error('Failed to generate audio');

        const blob = await response.blob();

        if (Platform.OS === 'web') {
          const blobUrl = URL.createObjectURL(blob);
          const { sound: newSound } = await Audio.Sound.createAsync(
            { uri: blobUrl },
            { shouldPlay: true }
          );

          newSound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.didJustFinish) {
              setIsSpeaking(false);
              setMouthOpenness(0);
            }
          });

          setSound(newSound);
          return;
        }

        // We can't play blobs directly in expo-av easily on native, so we save it as a local file
        const reader = new FileReader();

        reader.onload = async () => {
          const base64 = (reader.result as string).split(',')[1];
          const fileUri = FileSystem.cacheDirectory + `speech-${Date.now()}.mp3`;
          
          await FileSystem.writeAsStringAsync(fileUri, base64, {
            encoding: FileSystem.EncodingType.Base64,
          });

          const { sound: newSound } = await Audio.Sound.createAsync(
            { uri: fileUri },
            { shouldPlay: true }
          );

          newSound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.didJustFinish) {
              setIsSpeaking(false);
              setMouthOpenness(0);
            }
          });

          setSound(newSound);
        };
        reader.readAsDataURL(blob);
        return;
      } catch (err) {
        console.warn('ElevenLabs API failed, falling back to local TTS:', err);
      }
    }

    // Fallback or if API fails
    Speech.speak(text, {
      language: lang === 'si' ? 'si-LK' : lang === 'ta' ? 'ta-IN' : 'en-US',
      onDone: () => {
        setIsSpeaking(false);
        setMouthOpenness(0);
      },
      onStopped: () => {
        setIsSpeaking(false);
        setMouthOpenness(0);
      },
      onError: () => {
        setIsSpeaking(false);
        setMouthOpenness(0);
      },
    });
  };

  const stopSpeaking = () => {
    setIsSpeaking(false);
    setMouthOpenness(0);
    if (sound) {
      sound.stopAsync().catch(() => {});
      sound.unloadAsync().catch(() => {});
      setSound(null);
    }
    Speech.stop();
  };

  return (
    <ReporterContext.Provider value={{ isSpeaking, mouthOpenness, speakText, stopSpeaking }}>
      {children}
    </ReporterContext.Provider>
  );
}

export const useReporter = () => useContext(ReporterContext);
