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
  requestTTS: (messageId: string, text: string) => Promise<void>;
  togglePlayPause: () => void;
  discard: () => void;
}

const AudioCtx = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentAudio, setCurrentAudio] = useState<CurrentAudio | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const cleanup = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute("src");
      audioRef.current = null;
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, []);

  const discard = useCallback(() => {
    cleanup();
    setCurrentAudio(null);
  }, [cleanup]);

  const requestTTS = useCallback(
    async (messageId: string, text: string) => {
      cleanup();
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
        objectUrlRef.current = url;

        const audio = new Audio(url);
        audioRef.current = audio;

        audio.addEventListener("ended", () => {
          cleanup();
          setCurrentAudio(null);
        });

        await audio.play();
        setCurrentAudio({ status: "playing", messageId });
      } catch {
        cleanup();
        setCurrentAudio(null);
      }
    },
    [cleanup]
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

  return (
    <AudioCtx.Provider
      value={{ currentAudio, requestTTS, togglePlayPause, discard }}
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
