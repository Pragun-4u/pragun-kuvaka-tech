"use client";

import { useRef, useState } from "react";
import { useChat } from "@/lib/store/chatStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Paperclip, Send } from "lucide-react";
import Image from "next/image";

interface ChatInputProps {
  id: string;
  isTyping: boolean;
}

export default function ChatInput({ id, isTyping }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { addMessage, setIsTyping } = useChat();

  const handleSend = () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    addMessage(id, {
      text: trimmedInput,
      sender: "user",
      imageUrl: imagePreview || undefined,
    });
    setInput("");
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    setIsTyping(id, true);
    setTimeout(() => {
      addMessage(id, {
        text: `This is a simulated AI response to "${trimmedInput}"`,
        sender: "ai",
      });
      setIsTyping(id, false);
    }, 1500 + Math.random() * 1000);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 border-t bg-background">
      {imagePreview && (
        <div className="mb-2 relative w-fit">
          <Image
            height={100}
            width={100}
            src={imagePreview}
            alt="preview"
            className="h-24 w-auto rounded-md object-cover"
          />
          <button
            onClick={() => setImagePreview(null)}
            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold leading-none"
          >
            X
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
          className="hidden"
          id="file-upload"
        />
        <Button
          size="icon"
          variant="ghost"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !isTyping && handleSend()}
          placeholder="Type your message..."
          disabled={isTyping}
          autoComplete="off"
        />
        <Button onClick={handleSend} disabled={isTyping || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
