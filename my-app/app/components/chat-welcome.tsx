import { Bot } from "lucide-react";

export function ChatWelcome() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
        <Bot className="size-8 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">
          What do you want to know about the NBA?
        </h2>
        <p className="text-sm text-muted-foreground">
          Ask me anything — players, stats, history, trades, and more.
        </p>
      </div>
    </div>
  );
}
