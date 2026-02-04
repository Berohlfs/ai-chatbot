"use client";

import { Play, Pause, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/app/components/audio-context";

export function AudioPlayer() {
  const { currentAudio, togglePlayPause, discard } = useAudio();

  if (!currentAudio) return null;

  return (
    <div className="fixed left-4 top-4 z-50 flex items-center gap-2 rounded-xl border bg-background/95 px-3 py-2 shadow-lg backdrop-blur-sm">
      {currentAudio.status === "generating" ? (
        <Loader2 className="size-4 animate-spin text-muted-foreground" />
      ) : (
        <Button variant="ghost" size="icon-xs" onClick={togglePlayPause}>
          {currentAudio.status === "playing" ? (
            <Pause className="size-3" />
          ) : (
            <Play className="size-3" />
          )}
        </Button>
      )}
      <span className="text-xs font-medium text-foreground">
        {currentAudio.status === "generating"
          ? "Generating..."
          : currentAudio.status === "playing"
            ? "Playing"
            : "Paused"}
      </span>
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
