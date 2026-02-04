import { Chat } from "@/app/components/chat";
import { AudioProvider } from "@/app/components/audio-context";

export default function Home() {
  return (
    <AudioProvider>
      <Chat />
    </AudioProvider>
  );
}
