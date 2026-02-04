"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  onSend: (content: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setInput("");
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  return (
    <div className="bg-background px-4 pb-6 pt-2">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-3xl items-center gap-2 rounded-xl border bg-muted/50 px-3 py-2 shadow-sm"
      >
        <Input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={isLoading}
          className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
          autoComplete="off"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim() || isLoading}
        >
          <Send className="size-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </form>
    </div>
  );
}
