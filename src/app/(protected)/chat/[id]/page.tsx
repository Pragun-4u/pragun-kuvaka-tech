"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import ChatInput from "@/components/ChatInput";
import ChatMessage from "@/components/ChatMessage";
import { useChat } from "@/lib/store/chatStore";
import { toast } from "sonner";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { chats, getPreviousMessages } = useChat();
  const currentChat = chats[id];

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!currentChat) {
        router.push("/dashboard");
        toast.error("Chatroom not found.");
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [currentChat, router]);

  useEffect(() => {
    const scrollRef = scrollAreaRef.current;
    if (scrollRef && !currentChat.isTyping) {
      scrollRef.scrollTo({ top: scrollRef.scrollHeight, behavior: "smooth" });
    }
  }, [currentChat?.isTyping]);

  useEffect(() => {
    const scrollRef = scrollAreaRef.current;
    if (scrollRef) {
      scrollRef.scrollTo({ top: scrollRef.scrollHeight, behavior: "auto" });
    }
  }, [id]);

  useEffect(() => {
    const viewport = scrollAreaRef.current;
    if (!viewport || !currentChat?.hasMoreMessages) return;

    const handleScrolledToTop = () => {
      if (viewport.scrollTop === 0 && !isLoadingOlder) {
        setIsLoadingOlder(true);
        const previousHeight = viewport.scrollHeight;

        getPreviousMessages(id);

        setTimeout(() => {
          viewport.scrollTo({ top: 0, behavior: "smooth" });
          setIsLoadingOlder(false);
        }, 1000);
      }
    };

    viewport.addEventListener("scroll", handleScrolledToTop);
    return () => viewport.removeEventListener("scroll", handleScrolledToTop);
  }, [id, currentChat?.hasMoreMessages, getPreviousMessages, isLoadingOlder]);

  if (!currentChat) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const { messages, isTyping, hasMoreMessages, name } = currentChat;

  return (
    <div className="flex flex-col h-screen bg-card ">
      <header className="p-4 border-b text-center">
        <h1 className="text-xl font-semibold">{name}</h1>
      </header>

      <div
        className="flex-1 p-4 h-[400px] overflow-x-hidden"
        ref={scrollAreaRef}
      >
        {isLoadingOlder && (
          <div className="flex justify-center my-4">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          </div>
        )}
        {!hasMoreMessages && !isLoadingOlder && (
          <div className="flex justify-center my-4">
            <p className="text-sm text-muted-foreground">
              You are at the start of the conversation.
            </p>
          </div>
        )}

        {messages.map((msg: any) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground p-4">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>Gemini is typing...</span>
          </div>
        )}
      </div>

      <ChatInput isTyping={isTyping} id={id} />
    </div>
  );
}
