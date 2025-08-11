"use client";

import { useState, useEffect } from "react";
import { runStudyPlannerGenerator } from "@/app/actions";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { type Syllabus } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarCheck } from "lucide-react";

interface DailyPlan {
  day: string;
  plan: string;
}

export default function StudyPlannerView() {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [plan, setPlan] = useState<DailyPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const syllabusSnapshot = await getDocs(collection(db, "syllabus"));
        const syllabusData: Syllabus = {};
        syllabusSnapshot.forEach(doc => {
          syllabusData[doc.id] = doc.data();
        });
        const allSubjects = new Set<string>();
        Object.values(syllabusData).forEach(sem => {
          Object.values(sem).forEach(course => {
            if (course.title) allSubjects.add(course.title);
          });
        });
        setSubjects(Array.from(allSubjects).sort());
      } catch (error) {
        console.error("Error fetching subjects:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const handleCheckboxChange = (subject: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subject)
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const handleSubmit = async () => {
    if (selectedSubjects.length === 0) {
      toast({ variant: "destructive", description: "Please select at least one subject." });
      return;
    }
    setIsGenerating(true);
    setPlan([]);
    try {
      const result = await runStudyPlannerGenerator({ subjects: selectedSubjects });
      setPlan(result);
    } catch (error) {
      console.error("Error generating study plan:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not generate plan." });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 grid lg:grid-cols-12 gap-6">
      <div className="lg:col-span-4 xl:col-span-3">
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle>Study Planner</CardTitle>
            <CardDescription>Select difficult subjects to generate a 7-day plan.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80 pr-4">
              <div className="space-y-4">
                {isLoading
                  ? Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)
                  : subjects.map(subject => (
                      <div key={subject} className="flex items-center space-x-2">
                        <Checkbox
                          id={subject}
                          checked={selectedSubjects.includes(subject)}
                          onCheckedChange={() => handleCheckboxChange(subject)}
                        />
                        <label htmlFor={subject} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {subject}
                        </label>
                      </div>
                    ))}
              </div>
            </ScrollArea>
            <Button onClick={handleSubmit} disabled={isGenerating} className="w-full mt-6">
              {isGenerating ? "Generating..." : "Generate My Plan"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-8 xl:col-span-9">
         <Card className="h-full">
           <CardHeader>
             <CardTitle>Your 7-Day Study Plan</CardTitle>
             <CardDescription>Here is a structured plan based on your selected subjects.</CardDescription>
           </CardHeader>
           <CardContent>
             {isGenerating && (
                <div className="grid md:grid-cols-2 gap-4">
                  {Array.from({length: 7}).map((_, i) => (
                    <Card key={i} className="p-4 space-y-2">
                       <Skeleton className="h-5 w-1/3" />
                       <Skeleton className="h-4 w-full" />
                       <Skeleton className="h-4 w-5/6" />
                    </Card>
                  ))}
                </div>
             )}
            {plan.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                    {plan.map((dayPlan) => (
                      <Card key={dayPlan.day} className="p-4">
                          <h3 className="font-bold text-primary">{dayPlan.day}</h3>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{dayPlan.plan}</p>
                      </Card>
                    ))}
                </div>
              ) : (
                !isGenerating && (
                  <div className="flex flex-col items-center justify-center text-center py-16">
                     <CalendarCheck className="h-12 w-12 text-muted-foreground" />
                     <h3 className="mt-4 text-lg font-medium">Your plan will appear here</h3>
                     <p className="text-muted-foreground mt-1">Select subjects and click 'Generate My Plan' to start.</p>
                  </div>
                )
              )}
           </CardContent>
         </Card>
      </div>
    </div>
  );
}
