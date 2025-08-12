"use client";

import { useState, useEffect } from "react";
import { runExamStrategyGenerator } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Lightbulb, BookCheck, FileQuestion, History } from "lucide-react";
import { type User, type SavedExamStrategy } from "@/types";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format } from 'date-fns';

interface Strategy {
  likelyQuestions: string;
  revisionNotes: string;
  modelAnswer: string;
}

export default function ExamStrategyView({ user }: { user: User & { id: string } }) {
  const [subject, setSubject] = useState("");
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<SavedExamStrategy[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);

  useEffect(() => {
    if (!user.id) return;
    const q = query(
      collection(db, "students", user.id, "examStrategies"),
      orderBy("timestamp", "desc"),
      limit(10)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedHistory = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as SavedExamStrategy[];
      setHistory(fetchedHistory);
      setIsHistoryLoading(false);
    });
    return () => unsubscribe();
  }, [user.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;
    setIsLoading(true);
    setStrategy(null);
    try {
      const result = await runExamStrategyGenerator({ subject }, user.id);
      setStrategy(result);
    } catch (error) {
      console.error("Error generating exam strategy:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFromHistory = (item: SavedExamStrategy) => {
    setSubject(item.subject);
    setStrategy({
        likelyQuestions: item.likelyQuestions,
        revisionNotes: item.revisionNotes,
        modelAnswer: item.modelAnswer,
    });
  }

  return (
    <div className="p-4 sm:p-6 grid lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-8 xl:col-span-9 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Exam Strategy Generator</CardTitle>
            <CardDescription>Enter a subject to generate likely questions, revision notes, and a model answer.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-end gap-4">
              <div className="flex-1 w-full">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Operating Systems"
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? "Generating..." : "Generate Strategy"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        )}

        {strategy && (
          <Accordion type="multiple" defaultValue={["questions", "notes", "answer"]} className="w-full space-y-4">
            <Card>
              <AccordionItem value="questions" className="border-b-0">
                <AccordionTrigger className="p-6 text-left">
                  <div className="flex items-center gap-3"><FileQuestion className="h-5 w-5 text-primary"/>Likely Questions</div>
                </AccordionTrigger>
                <AccordionContent className="p-6 pt-0">
                  <div className="prose dark:prose-invert whitespace-pre-wrap">{strategy.likelyQuestions}</div>
                </AccordionContent>
              </AccordionItem>
            </Card>
            <Card>
              <AccordionItem value="notes" className="border-b-0">
                <AccordionTrigger className="p-6 text-left">
                  <div className="flex items-center gap-3"><BookCheck className="h-5 w-5 text-primary"/>Revision Notes</div>
                </AccordionTrigger>
                <AccordionContent className="p-6 pt-0">
                  <div className="prose dark:prose-invert whitespace-pre-wrap">{strategy.revisionNotes}</div>
                </AccordionContent>
              </AccordionItem>
            </Card>
            <Card>
              <AccordionItem value="answer" className="border-b-0">
                <AccordionTrigger className="p-6 text-left">
                  <div className="flex items-center gap-3"><Lightbulb className="h-5 w-5 text-primary"/>Model Answer</div>
                </AccordionTrigger>
                <AccordionContent className="p-6 pt-0">
                  <div className="prose dark:prose-invert whitespace-pre-wrap">{strategy.modelAnswer}</div>
                </AccordionContent>
              </AccordionItem>
            </Card>
          </Accordion>
        )}
      </div>

      <div className="lg:col-span-4 xl:col-span-3">
         <Card className="sticky top-6">
           <CardHeader>
             <CardTitle className="flex items-center gap-2"><History className="h-5 w-5" /> Recent History</CardTitle>
           </CardHeader>
           <CardContent>
             {isHistoryLoading ? (
                <div className="space-y-2">
                  {Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
             ) : history.length > 0 ? (
                <div className="space-y-2">
                  {history.map(item => (
                    <Button key={item.id} variant="ghost" className="h-auto w-full justify-start text-left" onClick={() => loadFromHistory(item)}>
                       <div>
                        <p className="font-semibold">{item.subject}</p>
                        <p className="text-xs text-muted-foreground">{format(item.timestamp.toDate(), 'PP p')}</p>
                       </div>
                    </Button>
                  ))}
                </div>
             ) : (
                <p className="text-sm text-muted-foreground text-center p-4">No history yet.</p>
             )}
           </CardContent>
         </Card>
      </div>
    </div>
  );
}