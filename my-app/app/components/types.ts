export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export type AudioStatus = "generating" | "playing" | "paused";
