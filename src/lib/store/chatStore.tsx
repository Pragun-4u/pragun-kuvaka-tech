"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { nanoid } from "nanoid";

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: "user" | "ai";
  imageUrl?: string;
}

export interface ChatData {
  id: string;
  name: string;
  messages: Message[];
  isTyping: boolean;
  currentPage: number;
  hasMoreMessages: boolean;
}

export interface ChatState {
  [chatId: string]: ChatData;
}

const totalHistoricalMessages = 60;
const MESSAGES_PER_PAGE = 20;

const dummyOlderMessages = Array.from(
  { length: totalHistoricalMessages },
  (_, i) => ({
    id: `hist-${totalHistoricalMessages - i}`,
    text: `This is an older, historical message number #${
      totalHistoricalMessages - i
    }.`,
    timestamp: new Date(Date.now() - (i + 15) * 60000).toISOString(),
    sender:
      (totalHistoricalMessages - i) % 2 === 0
        ? ("user" as const)
        : ("ai" as const),
  })
).reverse();

const getInitialMessages = () => {
  return {
    messages: dummyOlderMessages.slice(
      totalHistoricalMessages - MESSAGES_PER_PAGE
    ),
    currentPage: 1,
    hasMoreMessages: totalHistoricalMessages > MESSAGES_PER_PAGE,
  };
};

interface ChatContextType {
  chats: ChatState;
  isStoreInitialized: boolean;
  initializeChat: (name: string) => string;
  deleteChat: (chatId: string) => void;
  getPreviousMessages: (chatId: string) => void;
  addMessage: (
    chatId: string,
    message: Omit<Message, "id" | "timestamp">
  ) => void;
  setIsTyping: (chatId: string, isTyping: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<ChatState>({});
  const [isStoreInitialized, setIsStoreInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedChats = localStorage.getItem("chatStore");
      if (storedChats) {
        setChats(JSON.parse(storedChats));
      }
    } catch (error) {
      console.error("Failed to parse chats from localStorage", error);
      setChats({});
    }
    setIsStoreInitialized(true);
  }, []);

  useEffect(() => {
    if (isStoreInitialized) {
      localStorage.setItem("chatStore", JSON.stringify(chats));
    }
  }, [chats, isStoreInitialized]);

  const initializeChat = useCallback((name: string): string => {
    const chatId = nanoid();
    const newChat: ChatData = {
      id: chatId,
      name,
      isTyping: false,
      ...getInitialMessages(),
    };
    setChats((prev) => ({ ...prev, [chatId]: newChat }));
    return chatId;
  }, []);

  const deleteChat = useCallback((chatId: string) => {
    setChats((prev) => {
      const newChats = { ...prev };
      delete newChats[chatId];
      return newChats;
    });
  }, []);

  const getPreviousMessages = useCallback((chatId: string) => {
    setChats((prev) => {
      const chat = prev[chatId];
      if (!chat || !chat.hasMoreMessages) return prev;

      const nextPage = chat.currentPage + 1;
      const startIndex = totalHistoricalMessages - nextPage * MESSAGES_PER_PAGE;
      const endIndex =
        totalHistoricalMessages - chat.currentPage * MESSAGES_PER_PAGE;
      const newMessages = dummyOlderMessages.slice(
        Math.max(0, startIndex),
        endIndex
      );

      const updatedChat = {
        ...chat,
        messages: [...newMessages, ...chat.messages],
        currentPage: nextPage,
        hasMoreMessages: startIndex > 0,
      };
      return { ...prev, [chatId]: updatedChat };
    });
  }, []);

  const addMessage = useCallback(
    (chatId: string, message: Omit<Message, "id" | "timestamp">) => {
      setChats((prev) => {
        const chat = prev[chatId];
        if (!chat) return prev;
        const newMessage: Message = {
          ...message,
          id: nanoid(),
          timestamp: new Date().toISOString(),
        };
        const updatedChat = {
          ...chat,
          messages: [...chat.messages, newMessage],
        };
        return { ...prev, [chatId]: updatedChat };
      });
    },
    []
  );

  const setIsTyping = useCallback((chatId: string, isTyping: boolean) => {
    setChats((prev) => {
      const chat = prev[chatId];
      if (!chat || chat.isTyping === isTyping) return prev;
      const updatedChat = { ...chat, isTyping };
      return { ...prev, [chatId]: updatedChat };
    });
  }, []);

  const value = {
    chats,
    isStoreInitialized,
    initializeChat,
    deleteChat,
    getPreviousMessages,
    addMessage,
    setIsTyping,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
