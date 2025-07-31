"use client";

import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Send, Copy } from "lucide-react";
import { useMemo } from "react";

interface TextSelectionChatProps {
  selectedText: string;
  isOpen: boolean;
  onClose: () => void;
}

export function TextSelectionChat({
  selectedText,
  isOpen,
  onClose,
}: TextSelectionChatProps) {
  // Capture the selected text when modal first opens and keep it stable
  const capturedText = useMemo(() => {
    return isOpen ? selectedText : "";
  }, [isOpen, selectedText]);

  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    api: "/api/chat",
    body: {
      selectedText: capturedText,
    },
  });

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md h-96 flex flex-col" data-text-selection-chat>
        <DialogHeader>
          <DialogTitle>AI Assistant</DialogTitle>
          <DialogDescription className="truncate">
            About: &ldquo;{capturedText.substring(0, 30)}&hellip;&rdquo;
          </DialogDescription>
        </DialogHeader>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 -mx-6 px-6">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground text-sm">
              Ask me anything about your selected text!
            </div>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] ${message.role === "assistant" ? "group" : ""}`}
              >
                <div
                  className={`rounded-lg px-3 py-2 text-sm ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-muted"
                  }`}
                >
                  {message.content}
                </div>
                {message.role === "assistant" && (
                  <div className="flex justify-end mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(message.content)}
                      className="h-6 px-2 text-xs hover:bg-muted-foreground/10"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {status === "streaming" && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="pt-4 border-t -mx-6 px-6">
          <div className="flex space-x-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask about the selected text..."
              disabled={status === "streaming"}
              className="flex-1"
            />
            <Button
              type="submit"
              size="sm"
              disabled={status === "streaming" || !input.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
