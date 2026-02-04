import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
          {isUser ? (
            message.content
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                ul: ({ children }) => <ul className="mb-2 ml-4 list-disc last:mb-0">{children}</ul>,
                ol: ({ children }) => <ol className="mb-2 ml-4 list-decimal last:mb-0">{children}</ol>,
                li: ({ children }) => <li className="mb-0.5">{children}</li>,
                code: ({ children, className }) => {
                  const isBlock = className?.includes("language-");
                  if (isBlock) {
                    return (
                      <code className="block overflow-x-auto rounded-lg bg-background/50 p-3 text-xs">
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code className="rounded bg-background/50 px-1 py-0.5 text-xs">
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => <pre className="mb-2 last:mb-0">{children}</pre>,
                a: ({ href, children }) => (
                  <a href={href} className="underline" target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
                h1: ({ children }) => <h1 className="mb-2 text-lg font-bold">{children}</h1>,
                h2: ({ children }) => <h2 className="mb-2 text-base font-bold">{children}</h2>,
                h3: ({ children }) => <h3 className="mb-1 text-sm font-bold">{children}</h3>,
                blockquote: ({ children }) => (
                  <blockquote className="mb-2 border-l-2 border-foreground/20 pl-3 italic last:mb-0">
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                  <div className="mb-2 overflow-x-auto last:mb-0">
                    <table className="min-w-full text-xs">{children}</table>
                  </div>
                ),
                th: ({ children }) => <th className="border-b px-2 py-1 text-left font-semibold">{children}</th>,
                td: ({ children }) => <td className="border-b px-2 py-1">{children}</td>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
}
