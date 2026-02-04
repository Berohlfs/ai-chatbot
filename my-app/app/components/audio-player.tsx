"use client";

import { Play, Pause, X, Loader2, RotateCcw, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/app/components/audio-context";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const BARS = [
  { name: "audio-wave-1", duration: "1.2s", delay: "0ms" },
  { name: "audio-wave-2", duration: "1.0s", delay: "120ms" },
  { name: "audio-wave-3", duration: "1.4s", delay: "50ms" },
  { name: "audio-wave-1", duration: "0.9s", delay: "200ms" },
  { name: "audio-wave-2", duration: "1.3s", delay: "70ms" },
  { name: "audio-wave-3", duration: "1.1s", delay: "180ms" },
  { name: "audio-wave-1", duration: "1.0s", delay: "250ms" },
  { name: "audio-wave-2", duration: "1.2s", delay: "30ms" },
  { name: "audio-wave-3", duration: "0.9s", delay: "160ms" },
];

function Waveform({ playing }: { playing: boolean }) {
  return (
    <div className="flex h-5 w-24 items-center justify-center gap-[3px]">
      {BARS.map((bar, i) => (
        <div
          key={i}
          className="h-full w-1 rounded-full bg-foreground"
          style={{
            transformOrigin: "center",
            transform: playing ? undefined : "scaleY(0.2)",
            animation: playing
              ? `${bar.name} ${bar.duration} ease-in-out ${bar.delay} infinite`
              : "none",
            transition: playing ? "none" : "transform 0.3s ease",
          }}
        />
      ))}
    </div>
  );
}

export function AudioPlayer() {
  const { currentAudio, currentTime, duration, togglePlayPause, seek, discard } =
    useAudio();

  if (!currentAudio) return null;

  return (
    <div className="fixed right-4 top-20 z-50 flex items-center gap-2 rounded-xl border bg-background/95 px-3 py-2 shadow-lg backdrop-blur-sm">
      {currentAudio.status === "generating" ? (
        <Loader2 className="size-4 animate-spin text-muted-foreground" />
      ) : (
        <div className="flex items-center">
          <Button variant="ghost" size="icon-xs" onClick={() => seek(-10)}>
            <RotateCcw className="size-3" />
          </Button>
          <Button variant="ghost" size="icon-xs" onClick={togglePlayPause}>
            {currentAudio.status === "playing" ? (
              <Pause className="size-3" />
            ) : (
              <Play className="size-3" />
            )}
          </Button>
          <Button variant="ghost" size="icon-xs" onClick={() => seek(10)}>
            <RotateCw className="size-3" />
          </Button>
        </div>
      )}
      {currentAudio.status === "generating" ? (
        <span className="text-xs font-medium text-foreground">
          Generating...
        </span>
      ) : (
        <>
          <Waveform playing={currentAudio.status === "playing"} />
          <span className="min-w-22 text-center font-mono text-xs tabular-nums text-muted-foreground">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </>
      )}
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={discard}
        className="text-muted-foreground"
      >
        <X className="size-3" />
      </Button>
    </div>
  );
}
