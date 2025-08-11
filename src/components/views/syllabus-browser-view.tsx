
"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { type Syllabus, type User } from "@/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { runAiTutor } from "@/app/actions";
import { Bot, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription as DialogDescriptionComponent } from "@/components/ui/dialog";

export default function SyllabusBrowserView({ user }: { user: User }) {
  const [syllabus, setSyllabus] = useState<Syllabus | null>(null);
  const [syllabusContent, setSyllabusContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [aiResponse, setAiResponse] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSyllabus = async () => {
      try {
        const syllabusSnapshot = await getDocs(collection(db, "syllabus"));
         if (syllabusSnapshot.empty) {
          console.log("Syllabus not found in Firestore.");
          setIsLoading(false);
          return;
        }
        const syllabusData: Syllabus = {};
        syllabusSnapshot.forEach(doc => {
          syllabusData[doc.id] = doc.data();
        });
        setSyllabus(syllabusData);
        setSyllabusContent(JSON.stringify(syllabusData, null, 2));
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
    if (!syllabusContent) {
        toast({variant: 'destructive', title: 'Syllabus not loaded', description: 'Cannot get explanation without syllabus data.'});
        return;
    }
    setIsModalOpen(true);
    setIsAiLoading(true);
    setAiResponse("");
    try {
      const response = await runAiTutor({
        question: `Explain ${prompt} from ${title}`,
        syllabus: syllabusContent,
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
            <DialogDescriptionComponent>
              Here is a brief explanation of the selected topic.
            </DialogDescriptionComponent>
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
          {Object.entries(syllabus).sort((a, b) => a[0].localeCompare(b[0])).map(([semester, courses]) => (
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
                         {course.options && (
                          <div className="mt-4 space-y-2">
                            <h4 className="font-semibold text-sm">Elective Options</h4>
                             <p className="text-sm text-muted-foreground p-2">{course.options.join(' / ')}</p>
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
        <Card className="text-center p-8">
            <CardTitle>Syllabus Not Available</CardTitle>
            <CardDescription className="mt-2">
                The syllabus data has not been loaded yet. An administrator needs to upload it from the 'Setup & Data' page.
            </CardDescription>
        </Card>
      )}
    </div>
  );
}
