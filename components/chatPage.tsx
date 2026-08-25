"use client"

import { useState, useEffect, useRef } from "react"
import { SendIcon, X, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });
      if (!response.ok) throw new Error('Failed to get response');
      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.content || "Sorry, I couldn't process your request." }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedPrompts = [
    "Tell me about your programs",
    "How can I contact the faculty?",
    "What are your admission requirements?"
  ];

  const handleSuggestedPrompt = async (prompt: string) => {
    setInput("");
    setIsLoading(true);
    const userMessage: Message = { role: "user", content: prompt };
    setMessages(prev => [...prev, userMessage]);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });
      if (!response.ok) throw new Error('Failed to get response');
      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.content || "Sorry, I couldn't process your request." }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => setIsChatOpen(prev => !prev);

  return (
    <>
      {/* Chat icon button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary/90 transition transform z-50 ${isChatOpen ? 'scale-0' : 'scale-100'}`}
        aria-label={isChatOpen ? "" : "Open chat"}
      >
        <Bot size={24} />
      </button>

      {/* Chat window */}
      <div
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg transition-all duration-300 ease-in-out z-40 ${isChatOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}
      >
        <Card className="w-full flex flex-col h-[60vh] sm:h-[70vh] md:h-[75vh] shadow-xl">
          <CardHeader className="border-b px-4 py-2 sm:px-6 sm:py-3 flex items-center justify-start">
            <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Chat Support
            </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleChat}
                className="h-6 w-6 sm:h-8 sm:w-8 absolute left-2"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </Button>
          </CardHeader>

          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
              <div className="text-center space-y-2">
                <h2 className="text-lg sm:text-xl font-semibold">How can we help you?</h2>
                <p className="text-sm sm:text-base text-muted-foreground">Ask us anything about our institution and programs.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {suggestedPrompts.map((prompt, idx) => (
                    <Button key={idx} variant="outline" size="sm" onClick={() => handleSuggestedPrompt(prompt)}>
                      {prompt.length > 30 ? prompt.slice(0, 30) + '…' : prompt}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-full p-4 sm:p-6" ref={scrollAreaRef}>
                {messages.map((message, idx) => (
                  <div key={idx} className={`flex mb-3 ${message.role === "user" ? 'justify-end' : 'justify-start'}`}> 
                    <div className={`flex items-start max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}> 
                      <Avatar className="mt-1 mx-2 h-6 w-6 sm:h-8 sm:w-8"> 
                        <div className={`flex h-full w-full items-center justify-center rounded-full ${message.role === 'user' ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}> 
                          {message.role === 'user' ? 'U' : 'AI'} 
                        </div> 
                      </Avatar> 
                      <div className={`rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}> 
                        {message.content} 
                      </div> 
                    </div> 
                  </div> 
                ))} 
                {isLoading && ( 
                  <div className="flex mb-3 justify-start"> 
                    <div className="flex items-start max-w-[80%]"> 
                      <Avatar className="mt-1 mx-2 h-6 w-6 sm:h-8 sm:w-8"> 
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">AI</div> 
                      </Avatar> 
                      <div className="rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 bg-muted"> 
                        <div className="flex space-x-1 items-center"> 
                          <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"/> 
                          <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce delay-200"/> 
                          <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce delay-400"/> 
                        </div> 
                      </div> 
                    </div> 
                  </div> 
                )} 
              </ScrollArea> 
            </CardContent>
          )}

          <CardFooter className="border-t p-3 sm:p-4">
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={e => setInput(e.target.value)}
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                <SendIcon className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
