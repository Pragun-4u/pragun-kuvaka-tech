"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, MessageSquare, PlusCircle, Trash2 } from "lucide-react";

import { useChat } from "@/lib/store/chatStore";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Chatroom {
  id: string;
  name: string;
  lastMessage?: string;
}

export default function DashboardPage() {
  const { chats, initializeChat, deleteChat } = useChat();
  const router = useRouter();

  const chatFormatted = useMemo(() => {
    return Object.values(chats)
      .sort(
        (a, b) =>
          new Date(b.messages[b.messages.length - 1]?.timestamp).getTime() -
          new Date(a.messages[a.messages.length - 1]?.timestamp).getTime()
      )
      .map((chatObj) => {
        const lastMessage = chatObj.messages[chatObj.messages.length - 1]?.text;
        return {
          id: chatObj.id,
          name: chatObj.name,
          lastMessage,
        };
      });
  }, [chats]);

  const [filteredChatrooms, setFilteredChatrooms] = useState<Chatroom[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newChatroomName, setNewChatroomName] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreateChatroom = () => {
    if (newChatroomName.trim() === "") {
      toast.error("Chatroom name cannot be empty.");
      return;
    }
    initializeChat(newChatroomName.trim());
    toast.success(`Chatroom "${newChatroomName.trim()}" created successfully!`);
    setNewChatroomName("");
    setIsCreateDialogOpen(false);
  };

  const handleDeleteChatroom = (id: string, name: string) => {
    deleteChat(id);
    toast.success(`Chatroom "${name}" deleted successfully!`);
  };

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase().trim();
    let timer: NodeJS.Timeout;
    if (lowercasedQuery === "") {
      setFilteredChatrooms(chatFormatted);
    } else {
      timer = setTimeout(() => {
        const filtered = chatFormatted.filter((chatroom) =>
          chatroom.name.toLowerCase().includes(lowercasedQuery)
        );
        setFilteredChatrooms(filtered);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [searchQuery, chatFormatted]);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8">
      <div className="max-w-5xl mx-auto ">
        <header>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">My Chatrooms</h1>
            <p className="text-muted-foreground mt-2">
              Create, manage, and join conversations.
            </p>
          </div>
        </header>

        <div className="flex items-start flex-col md:flex-row justify-between my-4">
          <div className="flex items-center justify-center md:my-0 mb-4">
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="cursor-pointer">
                  <PlusCircle className="mr-2 h-4 w-4 " /> Create Chatroom
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Chatroom</DialogTitle>
                  <DialogDescription>
                    Give your new chatroom a distinct name.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-2 py-4">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newChatroomName}
                    autoComplete="off"
                    onChange={(e) => setNewChatroomName(e.target.value)}
                    placeholder="e.g., Q4 Planning Session"
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleCreateChatroom()
                    }
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    onClick={handleCreateChatroom}
                    className="w-full"
                  >
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Input
            type="text"
            placeholder="Search chatrooms..."
            className="w-full max-w-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredChatrooms.map((chatroom) => (
            <Card
              key={chatroom.id}
              className="group flex flex-col justify-between h-full transition-all duration-300 ease-in-out hover:shadow-xl dark:hover:shadow-primary/10 hover:-translate-y-1 cursor-pointer"
            >
              <CardHeader>
                <CardTitle className="flex items-start text-card-foreground">
                  <MessageSquare className="mr-3 h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                  <span>{chatroom.name}</span>
                </CardTitle>
                {chatroom.lastMessage && (
                  <CardDescription className="pt-2">
                    Last: "{chatroom.lastMessage}"
                  </CardDescription>
                )}
              </CardHeader>
              <CardFooter className="flex justify-between items-center bg-muted/30 p-4 mt-auto">
                <ConfirmDialog
                  title="Are you absolutely sure?"
                  description={
                    <>
                      This will permanently delete the{" "}
                      <span className="font-semibold text-foreground">
                        "{chatroom.name}"
                      </span>{" "}
                      chatroom. This action cannot be undone.
                    </>
                  }
                  onConfirm={() =>
                    handleDeleteChatroom(chatroom.id, chatroom.name)
                  }
                  trigger={
                    <Button
                      variant="destructive"
                      size="sm"
                      className="px-2"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  }
                />
                <Button
                  size="sm"
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/chat/${chatroom.id}`);
                  }}
                >
                  Join Chat{" "}
                  <ArrowRight className="group-hover:translate-x-1 ease-in ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredChatrooms.length === 0 && (
          <div className="col-span-full text-center py-20 bg-card border-2 border-dashed rounded-lg flex flex-col items-center animate-in fade-in-0 duration-500">
            <MessageSquare className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold text-foreground">
              No chatrooms here... yet!
            </h3>
            <p className="text-muted-foreground mt-2">
              Click the "Create Chatroom" button to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
