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

export default function StudyPlannerView() {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [plan, setPlan] = useState("");
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
    setPlan("");
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
    <div className="p-4 sm:p-6 grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Study Planner</CardTitle>
            <CardDescription>Select difficult subjects to generate a 7-day plan.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
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
            <Button onClick={handleSubmit} disabled={isGenerating} className="w-full mt-6">
              {isGenerating ? "Generating..." : "Generate My Plan"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Your 7-Day Study Plan</CardTitle>
          </CardHeader>
          <CardContent>
            {isGenerating && <Skeleton className="h-64 w-full" />}
            {plan ? (
              <div className="prose dark:prose-invert whitespace-pre-wrap">{plan}</div>
            ) : (
              !isGenerating && <p className="text-muted-foreground">Your generated plan will appear here.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
