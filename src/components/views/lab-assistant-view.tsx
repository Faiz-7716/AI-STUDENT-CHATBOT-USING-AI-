"use client";

import { useState } from "react";
import { runCodeSolutionGenerator } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Code, Lightbulb } from "lucide-react";

interface Solution {
  codeSolution: string;
  explanation: string;
}

export default function LabAssistantView() {
  const [description, setDescription] = useState("");
  const [solution, setSolution] = useState<Solution | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    setIsLoading(true);
    setSolution(null);
    try {
      const result = await runCodeSolutionGenerator({ exerciseDescription: description });
      setSolution(result);
    } catch (error) {
      console.error("Error generating code solution:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const formattedCode = solution?.codeSolution.replace(/```.*\n/,'').replace(/```/,'');

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Lab Assistant</CardTitle>
          <CardDescription>
            Describe a lab exercise or paste your code for debugging. Specify the programming language.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="description">Exercise Description / Code to Debug</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., 'Write a C++ program to demonstrate virtual functions' or paste code here..."
                className="min-h-[120px]"
                disabled={isLoading}
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Generating..." : "Generate Solution"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading && (
         <Card>
            <CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader>
            <CardContent><Skeleton className="h-40 w-full" /></CardContent>
         </Card>
      )}

      {solution && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Code className="h-5 w-5" /> Code Solution</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="prose bg-card-foreground/10 p-4 rounded-lg overflow-x-auto">
                <code>{formattedCode}</code>
              </pre>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5" /> Explanation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert whitespace-pre-wrap">{solution.explanation}</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
