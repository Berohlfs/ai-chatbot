"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/app/components/chat-message";
import { ChatInput } from "@/app/components/chat-input";
import { ChatWelcome } from "@/app/components/chat-welcome";
import { AudioPlayer } from "@/app/components/audio-player";
import { Toaster } from "@/components/ui/sonner";
import type { Message } from "@/app/components/types";

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(content: string) {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };

    const assistantId = crypto.randomUUID();
    const assistantMessage: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
    };

    const allMessages = [...messages, userMessage].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: allMessages }),
      });

      if (!response.ok) {
        const body = await response.text();
        console.error("API error:", response.status, body);
        throw new Error(`API error: ${response.status}`);
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? { ...msg, content: msg.content + chunk }
              : msg
          )
        );
      }
    } catch {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? { ...msg, content: "Something went wrong. Please try again." }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-dvh flex-col">
      <AudioPlayer />
      <Toaster />
      <header className="flex h-16 shrink-0 items-center border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-4">
          <div className="relative">
            <Image
              src="https://avatars.githubusercontent.com/u/90404673?v=4"
              alt="Bernardo Rohlfs"
              width={36}
              height={36}
              className="rounded-full"
            />
            <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-background bg-emerald-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-tight">News Summarizer</span>
            <span className="text-xs text-muted-foreground">Created by Bernardo Rohlfs</span>
          </div>
        </div>
      </header>

      <ScrollArea className="min-h-0 flex-1">
        <div className="mx-auto max-w-3xl px-4">
          {messages.length === 0 ? (
            <ChatWelcome />
          ) : (
            <div className="flex flex-col gap-6 py-8 pb-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </div>
  );
}
