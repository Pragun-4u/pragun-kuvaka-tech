import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Copy } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import ChatTimestamp from "./ChatTimestamp";
import { Message } from "@/lib/store/chatStore";

export default function ChatMessage({ message }: { message: Message }) {
  const isAi = message.sender === "ai";

  const onCopy = () => {
    navigator.clipboard.writeText(message.text);
    toast.success("Message copied to clipboard.");
  };

  return (
    <div
      className={cn("flex items-start gap-3 w-full", isAi ? "" : "justify-end")}
    >
      {isAi && (
        <Avatar className="h-8 w-8">
          <AvatarImage src="/gemini-logo.webp" alt="AI" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "flex flex-col gap-1 max-w-[75%]",
          isAi ? "items-start" : "items-end"
        )}
      >
        <div
          className={cn(
            "group p-3 rounded-lg relative",
            isAi ? "bg-muted" : "bg-primary text-primary-foreground"
          )}
        >
          {message.imageUrl && (
            <Image
              width={200}
              height={200}
              src={message.imageUrl}
              alt="upload"
              className="rounded-md mb-2 max-w-xs"
            />
          )}

          <p className="text-sm break-words">{message.text}</p>

          <Button
            onClick={onCopy}
            size="icon"
            variant="ghost"
            className={cn(
              `absolute top-1/2 -translate-y-1/2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity duration-200`,
              isAi ? "-right-12" : "-left-12"
            )}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        <ChatTimestamp key={message.timestamp} timestamp={message.timestamp} />
      </div>

      {!isAi && (
        <Avatar className="h-8 w-8">
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
