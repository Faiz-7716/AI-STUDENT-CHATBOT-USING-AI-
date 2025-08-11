
"use client";

import { useState, useRef, useEffect } from "react";
import { type User, type ChatMessage, type Syllabus, type Conversation } from "@/types";
import { runAiTutor } from "@/app/actions";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, query, orderBy, serverTimestamp, onSnapshot, doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Send, User as UserIcon, MessageSquarePlus, History, PanelRightOpen } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Card } from "../ui/card";
import { BookOpen } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface ChatViewProps {
  user: User & { id?: string };
}

export default function ChatView({ user }: ChatViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [syllabusContent, setSyllabusContent] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSyllabus = async () => {
      try {
        const syllabusSnapshot = await getDocs(collection(db, "syllabus"));
        if (syllabusSnapshot.empty) {
          setSyllabusContent("No syllabus data is available.");
          return;
        }
        const syllabusData: Syllabus = {};
        syllabusSnapshot.forEach(doc => {
          syllabusData[doc.id] = doc.data();
        });
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
    if (!user.id) return;
    const convosRef = collection(db, "students", user.id, "conversations");
    const q = query(convosRef, orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const convos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Conversation[];
      setConversations(convos);
      setIsHistoryLoading(false);
      // If no conversation is active and conversations exist, select the first one.
      // This happens on initial load.
      if (!activeConversationId && convos.length > 0) {
        setActiveConversationId(convos[0].id);
      }
    });
    return () => unsubscribe();
  }, [user.id]);

  useEffect(() => {
    if (!user.id || !activeConversationId) {
        setMessages([]);
        return;
    };
    const messagesRef = collection(db, "students", user.id, "conversations", activeConversationId, "messages");
    const q = query(messagesRef, orderBy("timestamp"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const history: ChatMessage[] = snapshot.docs.map(doc => doc.data() as ChatMessage);
      setMessages(history);
    }, (error) => {
      console.error("Error fetching chat history:", error);
    });

    return () => unsubscribe();
  }, [user.id, activeConversationId]);


  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  const handleNewConversation = () => {
    setActiveConversationId(null);
    setMessages([]);
    setIsSheetOpen(false);
  }
  
  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    setIsSheetOpen(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !syllabusContent || !user.id) return;
    
    setIsLoading(true);
    const currentInput = input;
    setInput("");

    let currentConversationId = activeConversationId;
    
    // Create a new conversation if one isn't active
    if (!currentConversationId) {
      const convoRef = await addDoc(collection(db, "students", user.id, "conversations"), {
        title: currentInput.substring(0, 40),
        timestamp: serverTimestamp()
      });
      currentConversationId = convoRef.id;
      setActiveConversationId(currentConversationId); // This will trigger the useEffect to fetch messages
    }
    
    const userMessage: ChatMessage = { role: "user", parts: [{ text: currentInput }] };
    const messagesRef = collection(db, "students", user.id, "conversations", currentConversationId!, "messages");
    await addDoc(messagesRef, { ...userMessage, timestamp: serverTimestamp() });
    
    // messages state might not be updated yet, so we get the history directly for the AI
    const historyForAi = [...messages, userMessage];

    try {
      const historyToPass = historyForAi.map(msg => ({
        role: msg.role,
        parts: msg.parts.map(p => ({text: p.text})),
      }));

      const aiResponse = await runAiTutor({
        question: currentInput,
        syllabus: syllabusContent,
        studentName: user.name,
        history: historyToPass,
      });

      const assistantMessage: ChatMessage = { role: "model", parts: [{ text: aiResponse }] };
      await addDoc(messagesRef, { ...assistantMessage, timestamp: serverTimestamp() });

    } catch (error) {
      console.error("AI Tutor Error:", error);
      const errorMessage: ChatMessage = {
        role: "model",
        parts: [{ text: "Sorry, I encountered an error. Please try again." }],
      };
      await addDoc(messagesRef, { ...errorMessage, timestamp: serverTimestamp() });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-4xl h-full flex flex-col relative">
          <div className="absolute top-0 right-0 z-10">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <PanelRightOpen className="h-5 w-5"/>
                        <span className="sr-only">Toggle Conversations History</span>
                    </Button>
                </SheetTrigger>
                <SheetContent className="w-[300px] sm:w-[400px] flex flex-col p-0">
                    <SheetHeader className="p-4 border-b">
                        <SheetTitle className="flex items-center gap-2"><History className="h-5 w-5"/> Conversations</SheetTitle>
                    </SheetHeader>
                    <div className="p-2">
                        <Button variant="outline" className="w-full" onClick={handleNewConversation}>
                        <MessageSquarePlus className="mr-2 h-4 w-4"/> New Chat
                        </Button>
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="px-2 pb-2 space-y-1">
                            {isHistoryLoading ? (
                                Array.from({length: 5}).map((_, i) => <Skeleton key={i} className="h-10 w-full"/>)
                            ) : (
                                conversations.map(convo => (
                                    <Button 
                                        key={convo.id} 
                                        variant={activeConversationId === convo.id ? "secondary" : "ghost"}
                                        className="w-full justify-start truncate"
                                        onClick={() => handleSelectConversation(convo.id)}
                                    >
                                        {convo.title}
                                    </Button>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </SheetContent>
            </Sheet>
          </div>
        <ScrollArea className="flex-1 mb-4 pr-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.length === 0 && !isLoading && (
              <div className="flex flex-col items-center text-center mt-16">
                <div className="p-4 bg-primary/10 rounded-full">
                   <BookOpen className="h-10 w-10 text-primary" />
                </div>
                <h2 className="mt-6 text-2xl font-semibold">Hello, {user.name}!</h2>
                <p className="text-muted-foreground">{activeConversationId ? "Continue your conversation." : "How can I help you with your studies today?"}</p>
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
              disabled={isLoading || !syllabusContent || !user.id}
            />
            <Button type="submit" disabled={isLoading || !syllabusContent || !user.id}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
