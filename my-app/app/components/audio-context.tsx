"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
} from "react";
import type { AudioStatus } from "@/app/components/types";

interface CurrentAudio {
  status: AudioStatus;
  messageId: string;
}

interface AudioContextValue {
  currentAudio: CurrentAudio | null;
  currentTime: number;
  duration: number;
  requestTTS: (messageId: string, text: string) => Promise<void>;
  togglePlayPause: () => void;
  seek: (seconds: number) => void;
  discard: () => void;
}

const AudioCtx = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentAudio, setCurrentAudio] = useState<CurrentAudio | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [generatedAudios, setGeneratedAudios] = useState<Map<string, string>>(
    () => new Map()
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const cleanup = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute("src");
      audioRef.current = null;
    }
  }, []);

  const discard = useCallback(() => {
    cleanup();
    setCurrentAudio(null);
    setCurrentTime(0);
    setDuration(0);
  }, [cleanup]);

  const playFromUrl = useCallback(
    (messageId: string, url: string) => {
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.addEventListener("loadedmetadata", () => {
        setDuration(audio.duration);
      });

      audio.addEventListener("timeupdate", () => {
        setCurrentTime(audio.currentTime);
      });

      audio.addEventListener("ended", () => {
        setCurrentAudio((prev) =>
          prev ? { ...prev, status: "paused" } : null
        );
      });

      audio.play();
      setCurrentAudio({ status: "playing", messageId });
    },
    []
  );

  const requestTTS = useCallback(
    async (messageId: string, text: string) => {
      cleanup();

      const cachedUrl = generatedAudios.get(messageId);
      if (cachedUrl) {
        playFromUrl(messageId, cachedUrl);
        return;
      }

      setCurrentAudio({ status: "generating", messageId });

      try {
        const response = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });

        if (!response.ok) {
          setCurrentAudio(null);
          throw new Error("TTS request failed");
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        setGeneratedAudios((prev) => new Map(prev).set(messageId, url));
        playFromUrl(messageId, url);
      } catch {
        cleanup();
        setCurrentAudio(null);
      }
    },
    [cleanup, generatedAudios, playFromUrl]
  );

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current || !currentAudio) return;

    if (currentAudio.status === "playing") {
      audioRef.current.pause();
      setCurrentAudio((prev) =>
        prev ? { ...prev, status: "paused" } : null
      );
    } else if (currentAudio.status === "paused") {
      audioRef.current.play();
      setCurrentAudio((prev) =>
        prev ? { ...prev, status: "playing" } : null
      );
    }
  }, [currentAudio]);

  const seek = useCallback((seconds: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(
      0,
      Math.min(audioRef.current.duration, audioRef.current.currentTime + seconds)
    );
  }, []);

  return (
    <AudioCtx.Provider
      value={{ currentAudio, currentTime, duration, requestTTS, togglePlayPause, seek, discard }}
    >
      {children}
    </AudioCtx.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error("useAudio must be used within AudioProvider");
  return ctx;
}
