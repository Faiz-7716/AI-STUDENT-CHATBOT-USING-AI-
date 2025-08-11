"use client";

import { useState } from "react";
import { runExamStrategyGenerator } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Lightbulb, BookCheck, FileQuestion } from "lucide-react";

interface Strategy {
  likelyQuestions: string;
  revisionNotes: string;
  modelAnswer: string;
}

export default function ExamStrategyView() {
  const [subject, setSubject] = useState("");
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;
    setIsLoading(true);
    setStrategy(null);
    try {
      const result = await runExamStrategyGenerator({ subject });
      setStrategy(result);
    } catch (error) {
      console.error("Error generating exam strategy:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Exam Strategy Generator</CardTitle>
          <CardDescription>Enter a subject to generate likely questions, revision notes, and a model answer.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex items-end gap-4">
            <div className="flex-1">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Operating Systems"
                disabled={isLoading}
              />
            </div>
            <Button type="submit" disabled={isLoading}>
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
              <AccordionTrigger className="p-6">
                <div className="flex items-center gap-3"><FileQuestion className="h-5 w-5 text-primary"/>Likely Questions</div>
              </AccordionTrigger>
              <AccordionContent className="p-6 pt-0">
                <div className="prose dark:prose-invert whitespace-pre-wrap">{strategy.likelyQuestions}</div>
              </AccordionContent>
            </AccordionItem>
          </Card>
          <Card>
            <AccordionItem value="notes" className="border-b-0">
              <AccordionTrigger className="p-6">
                <div className="flex items-center gap-3"><BookCheck className="h-5 w-5 text-primary"/>Revision Notes</div>
              </AccordionTrigger>
              <AccordionContent className="p-6 pt-0">
                <div className="prose dark:prose-invert whitespace-pre-wrap">{strategy.revisionNotes}</div>
              </AccordionContent>
            </AccordionItem>
          </Card>
          <Card>
            <AccordionItem value="answer" className="border-b-0">
              <AccordionTrigger className="p-6">
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
  );
}
