import * as React from "react";
import { Send, Loader2, AlertCircle, Bug, Copy, Check } from "lucide-react";
import { Input } from "~/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";
import { useChat } from "ai/react";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Markdown } from "~/components/ui/markdown";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

export function MoneyWorksAIChat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error, id: chatId } =
    useChat({
      api: "/api/moneyworks-ai",
      onError: (err) => {
        console.error("Chat error:", err);
      },
    });

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const formRef = React.useRef<HTMLFormElement>(null);
  const scrollIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const [copied, setCopied] = useState(false);

  // Auto-scroll to bottom when new messages arrive or content changes
  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };

    // Initial scroll
    scrollToBottom();

    // If loading (streaming), continuously scroll to bottom
    if (isLoading) {
      scrollIntervalRef.current = setInterval(scrollToBottom, 100);
    } else {
      // Clear interval when not loading
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
    }

    // Cleanup interval on unmount or when loading changes
    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
    };
  }, [messages, isLoading]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    handleSubmit(e);
  };

  const copyDebugUrl = async () => {
    const debugUrl = `${window.location.origin}/api/chat/debug/${chatId}`;
    try {
      await navigator.clipboard.writeText(debugUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      console.log("Debug URL copied:", debugUrl);
    } catch (err) {
      console.error("Failed to copy debug URL:", err);
    }
  };

  return (
    <TooltipProvider>
      <Card className="h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>MoneyWorks AI Assistant</CardTitle>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={copyDebugUrl}
                className="h-8 w-8"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Bug className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy debug URL for this chat session</p>
            </TooltipContent>
          </Tooltip>
        </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 min-h-0">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error.message || "An error occurred"}
            </AlertDescription>
          </Alert>
        )}

        <ScrollArea className="flex-1 pr-4 h-full" ref={scrollRef}>
          <div className="space-y-4 pb-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <p className="text-sm">Welcome to MoneyWorks AI Assistant!</p>
                <p className="text-xs mt-2">
                  I can help you with MoneyWorks accounting tasks, MWScript,
                  reports, and more.
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.role === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg px-4 py-2",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted",
                    )}
                  >
                    <Markdown
                      content={message.content}
                      className={message.role === "user" ? "text-primary-foreground" : ""}
                    />
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(
                        message.createdAt || Date.now(),
                      ).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={onSubmit} className="flex gap-2 w-full" ref={formRef}>
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about MoneyWorks..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            size="icon"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
    </TooltipProvider>
  );
}
