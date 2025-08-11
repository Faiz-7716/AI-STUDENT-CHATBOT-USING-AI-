"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { type Syllabus } from "@/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { runAiTutor } from "@/app/actions";
import { Bot, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const SYLLABUS_CONTENT_STUB = "This is a placeholder for the full syllabus content which would be fetched and passed to the AI.";

export default function SyllabusBrowserView({ user }: { user: any }) {
  const [syllabus, setSyllabus] = useState<Syllabus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [aiResponse, setAiResponse] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSyllabus = async () => {
      try {
        const syllabusSnapshot = await getDocs(collection(db, "syllabus"));
        const syllabusData: Syllabus = {};
        syllabusSnapshot.forEach(doc => {
          syllabusData[doc.id] = doc.data();
        });
        setSyllabus(syllabusData);
      } catch (error) {
        console.error("Error fetching syllabus:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not fetch syllabus." });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSyllabus();
  }, [toast]);

  const handlePromptClick = async (prompt: string, title: string) => {
    setIsModalOpen(true);
    setIsAiLoading(true);
    setAiResponse("");
    try {
      const response = await runAiTutor({
        question: `Explain ${prompt} from ${title}`,
        syllabus: SYLLABUS_CONTENT_STUB,
        studentName: user.name,
      });
      setAiResponse(response);
    } catch (error) {
      setAiResponse("Sorry, there was an error getting an explanation.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Bot /> AI Explanation</DialogTitle>
            <DialogDescription>
              Here is a brief explanation of the selected topic.
            </DialogDescription>
          </DialogHeader>
          <div className="prose dark:prose-invert max-h-[60vh] overflow-y-auto pr-2">
            {isAiLoading ? <Loader2 className="animate-spin h-8 w-8 mx-auto"/> : <div dangerouslySetInnerHTML={{ __html: aiResponse.replace(/\n/g, '<br />') }} />}
          </div>
        </DialogContent>
      </Dialog>
      
      {isLoading ? (
        <Card><CardContent className="p-6 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
        </CardContent></Card>
      ) : syllabus ? (
        <Accordion type="single" collapsible className="w-full">
          {Object.entries(syllabus).sort().map(([semester, courses]) => (
            <AccordionItem key={semester} value={semester}>
              <AccordionTrigger className="text-lg font-semibold">{semester}</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 p-2">
                  {Object.entries(courses).map(([courseCode, course]) => (
                    <Card key={courseCode}>
                      <CardHeader>
                        <CardTitle className="text-base">{courseCode}: {course.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {course.units && (
                          <div className="space-y-2">
                            <h4 className="font-semibold text-sm">Units</h4>
                            {course.units.map((unit, i) => (
                              <Button key={i} variant="ghost" className="w-full justify-start text-left h-auto" onClick={() => handlePromptClick(unit, course.title)}>{unit}</Button>
                            ))}
                          </div>
                        )}
                        {course.exercises && (
                          <div className="mt-4 space-y-2">
                            <h4 className="font-semibold text-sm">Lab Exercises</h4>
                            {course.exercises.map((exercise, i) => (
                              <Button key={i} variant="ghost" className="w-full justify-start text-left h-auto" onClick={() => handlePromptClick(exercise, course.title)}>{exercise}</Button>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <p className="text-muted-foreground text-center py-8">Syllabus not available.</p>
      )}
    </div>
  );
}
