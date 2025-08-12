"use client";

import { useState, useEffect } from "react";
import { runCodeSolutionGenerator } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Code, Lightbulb, History } from "lucide-react";
import { type User, type SavedLabSolution } from "@/types";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format } from 'date-fns';

interface Solution {
  codeSolution: string;
  explanation: string;
}

export default function LabAssistantView({ user }: { user: User & { id: string } }) {
  const [description, setDescription] = useState("");
  const [solution, setSolution] = useState<Solution | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<SavedLabSolution[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);

  useEffect(() => {
    if (!user.id) return;
    const q = query(
      collection(db, "students", user.id, "labSolutions"),
      orderBy("timestamp", "desc"),
      limit(10)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedHistory = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as SavedLabSolution[];
      setHistory(fetchedHistory);
      setIsHistoryLoading(false);
    });
    return () => unsubscribe();
  }, [user.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    setIsLoading(true);
    setSolution(null);
    try {
      const result = await runCodeSolutionGenerator({ exerciseDescription: description }, user.id);
      setSolution(result);
    } catch (error) {
      console.error("Error generating code solution:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFromHistory = (item: SavedLabSolution) => {
    setDescription(item.exerciseDescription);
    setSolution({
        codeSolution: item.codeSolution,
        explanation: item.explanation,
    });
  }
  
  const formattedCode = solution?.codeSolution.replace(/```.*\n/,'').replace(/```/,'');

  return (
    <div className="p-4 sm:p-6 grid lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-8 xl:col-span-9 space-y-6">
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
                        <p className="font-semibold truncate">{item.exerciseDescription}</p>
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