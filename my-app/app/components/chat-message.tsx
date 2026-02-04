import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Message } from "@/app/components/types";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "flex max-w-[80%] flex-col gap-1",
          isUser ? "items-end" : "items-start"
        )}
      >
        <span className="flex items-center gap-1.5 px-1 text-xs text-muted-foreground">
          {isUser ? <User className="size-3" /> : <Bot className="size-3" />}
          {isUser ? "You" : "AI"}
        </span>
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground"
          )}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
}
