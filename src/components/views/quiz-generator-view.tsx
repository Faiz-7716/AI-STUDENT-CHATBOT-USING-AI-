
"use client";

import { useState, useEffect, useMemo } from "react";
import { runGenerateQuiz, saveQuizResult } from "@/app/actions";
import { db } from "@/lib/firebase";
import { collection, getDocs, onSnapshot, query, orderBy } from "firebase/firestore";
import { type Syllabus, type User, type ParsedQuiz, type QuizResult } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { History, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "../ui/badge";

const PASS_PERCENTAGE = 75;

const chartConfig = {
  correct: { label: "Correct", color: "hsl(var(--primary))" },
  incorrect: { label: "Incorrect", color: "hsl(var(--destructive))" },
} satisfies ChartConfig;

const historyChartConfig = {
    passed: { label: "Passed", color: "hsl(var(--primary))" },
    failed: { label: "Failed", color: "hsl(var(--destructive))" },
} satisfies ChartConfig;

const parseQuizText = (text: string): ParsedQuiz => {
    const questions: ParsedQuiz['questions'] = [];
    const answerKey: ParsedQuiz['answerKey'] = {};

    const lines = text.split('\n').filter(line => line.trim() !== '');
    let currentQuestion: any = null;

    const questionRegex = /^\d+\.\s(.+)/;
    const optionRegex = /^[A-C]\)\s(.+)/;
    const answerKeyHeaderRegex = /Answer Key:/i;
    const answerKeyRegex = /(\d+)\.\s*([A-C])/g;

    let readingAnswers = false;

    for (const line of lines) {
        if (answerKeyHeaderRegex.test(line)) {
            readingAnswers = true;
            continue;
        }

        if (readingAnswers) {
            let match;
            while ((match = answerKeyRegex.exec(line)) !== null) {
                answerKey[parseInt(match[1])] = match[2];
            }
        } else {
            const questionMatch = line.match(questionRegex);
            if (questionMatch) {
                if (currentQuestion) {
                    questions.push(currentQuestion);
                }
                currentQuestion = { question: questionMatch[1].trim(), options: {} };
            } else {
                const optionMatch = line.match(optionRegex);
                if (optionMatch && currentQuestion) {
                    const key = line.substring(0, 1) as 'A' | 'B' | 'C';
                    currentQuestion.options[key] = optionMatch[1].trim();
                }
            }
        }
    }

    if (currentQuestion) {
        questions.push(currentQuestion);
    }

    // Assign the correct answer to each question object
    questions.forEach((q, index) => {
        const questionNumber = index + 1;
        if (answerKey[questionNumber]) {
            q.answer = answerKey[questionNumber];
        }
    });

    return { questions, answerKey };
};


export default function QuizGeneratorView({ user }: { user: User & { id: string } }) {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [quiz, setQuiz] = useState<ParsedQuiz | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<QuizResult[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const syllabusSnapshot = await getDocs(collection(db, "syllabus"));
        const allSubjects = new Set<string>();
        syllabusSnapshot.forEach(doc => {
            const sem = doc.data()
            Object.values(sem).forEach((course: any) => {
                if (course.title) allSubjects.add(course.title);
            });
        });
        const sortedSubjects = Array.from(allSubjects).sort();
        setSubjects(sortedSubjects);
        if (sortedSubjects.length > 0) {
          setSelectedSubject(sortedSubjects[0]);
        }
      } catch (error) { console.error("Error fetching subjects:", error);
      } finally { setIsLoadingSubjects(false); }
    };
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (!user.id) return;
    const q = query(
      collection(db, "students", user.id, "quizResults"),
      orderBy("timestamp", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedHistory = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as QuizResult[];
      setHistory(fetchedHistory);
      setIsHistoryLoading(false);
    });
    return () => unsubscribe();
  }, [user.id]);

  const handleGenerateQuiz = async () => {
    if (!selectedSubject) {
      toast({ variant: "destructive", description: "Please select a subject." });
      return;
    }
    setIsGenerating(true);
    setQuiz(null);
    setResult(null);
    setUserAnswers({});
    try {
      const resultText = await runGenerateQuiz({ subject: selectedSubject });
      const parsed = parseQuizText(resultText);
      setQuiz(parsed);
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not generate quiz." });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setUserAnswers(prev => ({ ...prev, [questionIndex]: answer }));
  };

  const handleSubmitQuiz = async () => {
    if (Object.keys(userAnswers).length !== quiz?.questions.length) {
      toast({ variant: "destructive", description: "Please answer all questions." });
      return;
    }
    let score = 0;
    quiz?.questions.forEach((q, index) => {
      if (userAnswers[index] === q.answer) {
        score++;
      }
    });

    const newResult: Omit<QuizResult, 'id' | 'timestamp'> = {
        subject: selectedSubject,
        score,
        total: quiz.questions.length,
        percentage: (score / quiz.questions.length) * 100,
        correctAnswers: score,
        incorrectAnswers: quiz.questions.length - score,
    };
    setResult(newResult as QuizResult);

    try {
      await saveQuizResult(newResult, user.id);
      toast({title: "Quiz Submitted!", description: "Your results have been saved."})
    } catch (error) {
      console.error("Error saving quiz result:", error);
      toast({variant: "destructive", title: "Error", description: "Could not save your results."})
    }
  }
  
  const singleQuizChartData = useMemo(() => ([
    { name: "Correct", value: result?.correctAnswers ?? 0, fill: "var(--color-correct)" },
    { name: "Incorrect", value: result?.incorrectAnswers ?? 0, fill: "var(--color-incorrect)" },
  ]), [result]);

  const historyStats = useMemo(() => {
    const passed = history.filter(h => h.percentage >= PASS_PERCENTAGE).length;
    const failed = history.length - passed;
    return [
      { name: 'Passed', value: passed, fill: 'var(--color-passed)' },
      { name: 'Failed', value: failed, fill: 'var(--color-failed)' }
    ];
  }, [history]);

  return (
    <div className="p-4 sm:p-6 grid lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-8 xl:col-span-9 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Quiz Generator</CardTitle>
            <CardDescription>Select a subject to generate a 15-question quiz.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row items-end gap-4">
            <div className="flex-1 w-full">
              <label className="text-sm font-medium">Subject</label>
              {isLoadingSubjects ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select value={selectedSubject} onValueChange={setSelectedSubject} disabled={isGenerating}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map(subject => (
                      <SelectItem key={subject} value={subject} className="text-sm">{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <Button onClick={handleGenerateQuiz} disabled={isGenerating || isLoadingSubjects} className="w-full sm:w-auto">
              {isGenerating ? "Generating..." : "Generate Quiz"}
            </Button>
          </CardContent>
        </Card>

        {isGenerating && (
          <Card><CardContent className="p-6"><Skeleton className="h-64 w-full" /></CardContent></Card>
        )}

        {quiz && !result && (
          <Card>
            <CardHeader><CardTitle>Quiz on {selectedSubject}</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              {quiz.questions.map((q, index) => (
                <div key={index}>
                    <p className="font-medium mb-2 text-sm">{index + 1}. {q.question}</p>
                    <RadioGroup onValueChange={(value) => handleAnswerChange(index, value)} className="text-sm space-y-1">
                        {Object.entries(q.options).map(([key, value]) => (
                            <div key={key} className="flex items-center space-x-2">
                                <RadioGroupItem value={key} id={`q${index}-${key}`} />
                                <Label htmlFor={`q${index}-${key}`} className="font-normal">{value}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
              ))}
              <Button onClick={handleSubmitQuiz} className="w-full">Submit Quiz</Button>
            </CardContent>
          </Card>
        )}

        {result && (
            <Card>
                <CardHeader>
                    <CardTitle>Quiz Results for {result.subject}</CardTitle>
                    <CardDescription>You scored {result.score} out of {result.total}. Passing score is {PASS_PERCENTAGE}%.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="h-52">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                <Pie data={singleQuizChartData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={5}>
                                     {singleQuizChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                     ))}
                                </Pie>
                            </PieChart>
                         </ResponsiveContainer>
                    </div>
                     <div className="h-52">
                        <ResponsiveContainer width="100%" height="100%">
                             <BarChart data={singleQuizChartData} layout="vertical" margin={{ left: 10, right: 10 }}>
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="value" radius={5}>
                                {singleQuizChartData.map((entry) => (
                                    <Cell key={entry.name} fill={entry.fill} />
                                ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        )}
      </div>

       <div className="lg:col-span-4 xl:col-span-3">
         <Card className="sticky top-6">
           <CardHeader>
             <CardTitle className="flex items-center gap-2"><History className="h-5 w-5" /> Quiz History</CardTitle>
           </CardHeader>
           <CardContent>
             {isHistoryLoading ? (
                <div className="space-y-2">
                  {Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
             ) : history.length > 0 ? (
                <div className="space-y-4">
                  <div className="h-32">
                    <ChartContainer config={historyChartConfig}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                <Legend content={({ payload }) => (
                                    <div className="flex gap-4 justify-center text-xs">
                                        {payload?.map((item: any) => (
                                            <div key={item.value} className="flex items-center gap-1">
                                            <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></div>
                                            <span>{item.value} ({item.payload.value})</span>
                                            </div>
                                        ))}
                                    </div>
                                )}/>
                                <Pie data={historyStats} dataKey="value" nameKey="name" innerRadius={40}>
                                    {historyStats.map((entry) => (
                                        <Cell key={entry.name} fill={entry.fill} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                  </div>

                  <div className="max-h-64 overflow-y-auto pr-2 space-y-2">
                    {history.map(item => (
                        <div key={item.id} className="flex justify-between items-center p-2 rounded-lg bg-muted/50 text-sm">
                        <div>
                            <p className="font-semibold truncate max-w-[150px] sm:max-w-[200px]" title={item.subject}>{item.subject}</p>
                            <p className="text-xs text-muted-foreground">{format(item.timestamp.toDate(), 'PP p')}</p>
                        </div>
                        <Badge variant={item.percentage >= PASS_PERCENTAGE ? "default" : "destructive"}>{Math.round(item.percentage)}%</Badge>
                        </div>
                    ))}
                  </div>
                </div>
             ) : (
                <p className="text-sm text-muted-foreground text-center p-4">No quiz history yet.</p>
             )}
           </CardContent>
         </Card>
      </div>
    </div>
  );
}
