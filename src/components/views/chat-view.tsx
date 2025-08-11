
"use client";

import { useState, useRef, useEffect } from "react";
import { type User, type ChatMessage, type Syllabus } from "@/types";
import { runAiTutor } from "@/app/actions";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Send, User as UserIcon } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Card } from "../ui/card";
import { BookOpen } from "lucide-react";

interface ChatViewProps {
  user: User;
}

export default function ChatView({ user }: ChatViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [syllabusContent, setSyllabusContent] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSyllabus = async () => {
      try {
        const syllabusSnapshot = await getDocs(collection(db, "syllabus"));
        if (syllabusSnapshot.empty) {
          console.log("Syllabus not found in Firestore.");
          setSyllabusContent("No syllabus data is available.");
          return;
        }
        const syllabusData: Syllabus = {};
        syllabusSnapshot.forEach(doc => {
          syllabusData[doc.id] = doc.data();
        });
        // Convert the structured syllabus into a string for the AI
        const syllabusString = JSON.stringify(syllabusData, null, 2);
        setSyllabusContent(syllabusString);
      } catch (error) {
        console.error("Error fetching syllabus:", error);
        setSyllabusContent("Error fetching syllabus data.");
      }
    };
    fetchSyllabus();
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !syllabusContent) return;

    const userMessage: ChatMessage = { role: "user", parts: [{ text: input }] };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const aiResponse = await runAiTutor({
        question: input,
        syllabus: syllabusContent,
        studentName: user.name,
      });
      const assistantMessage: ChatMessage = { role: "model", parts: [{ text: aiResponse }] };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: "model",
        parts: [{ text: "Sorry, I encountered an error. Please try again." }],
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-4xl h-full flex flex-col">
        <ScrollArea className="flex-1 mb-4 pr-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.length === 0 && !isLoading && (
              <div className="flex flex-col items-center text-center mt-16">
                <div className="p-4 bg-primary/10 rounded-full">
                   <BookOpen className="h-10 w-10 text-primary" />
                </div>
                <h2 className="mt-6 text-2xl font-semibold">Hello, {user.name}!</h2>
                <p className="text-muted-foreground">How can I help you with your studies today?</p>
              </div>
            )}
            {messages.map((message, index) => (
              <div key={index} className={`flex items-start gap-4 ${message.role === "user" ? "justify-end" : ""}`}>
                {message.role === "model" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                  </Avatar>
                )}
                <div className={`max-w-xl rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border"
                }`}>
                  <div className="prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: message.parts[0].text.replace(/\n/g, '<br />') }} />
                </div>
                 {message.role === "user" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback><UserIcon className="h-5 w-5"/></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-4">
                 <Avatar className="h-8 w-8">
                    <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                  </Avatar>
                <div className="max-w-xl w-full rounded-lg p-3 bg-card border space-y-2">
                   <Skeleton className="h-4 w-4/5" />
                   <Skeleton className="h-4 w-full" />
                   <Skeleton className="h-4 w-3/5" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <Card className="p-2 rounded-xl shadow-lg">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your syllabus..."
              className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              disabled={isLoading || !syllabusContent}
            />
            <Button type="submit" disabled={isLoading || !syllabusContent}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
