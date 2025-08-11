"use client";

import { useState, useEffect } from "react";
import { runGenerateQuiz } from "@/app/actions";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { type Syllabus } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function QuizGeneratorView() {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [quiz, setQuiz] = useState("");
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);
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
        const sortedSubjects = Array.from(allSubjects).sort();
        setSubjects(sortedSubjects);
        if (sortedSubjects.length > 0) {
          setSelectedSubject(sortedSubjects[0]);
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
      } finally {
        setIsLoadingSubjects(false);
      }
    };
    fetchSubjects();
  }, []);

  const handleSubmit = async () => {
    if (!selectedSubject) {
      toast({ variant: "destructive", description: "Please select a subject." });
      return;
    }
    setIsGenerating(true);
    setQuiz("");
    try {
      const result = await runGenerateQuiz({ subject: selectedSubject });
      setQuiz(result);
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not generate quiz." });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quiz Generator</CardTitle>
          <CardDescription>Select a subject to generate a 5-question quiz.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-end gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium">Subject</label>
            {isLoadingSubjects ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select value={selectedSubject} onValueChange={setSelectedSubject} disabled={isGenerating}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <Button onClick={handleSubmit} disabled={isGenerating || isLoadingSubjects}>
            {isGenerating ? "Generating..." : "Generate Quiz"}
          </Button>
        </CardContent>
      </Card>

      {isGenerating && (
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      )}

      {quiz && (
        <Card>
          <CardHeader>
            <CardTitle>Quiz on {selectedSubject}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert whitespace-pre-wrap">{quiz}</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
