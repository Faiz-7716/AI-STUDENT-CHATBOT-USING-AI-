"use server";

import { aiTutor, type AiTutorInput } from "@/ai/flows/ai-tutor";
import { codeSolutionGenerator, type CodeSolutionGeneratorInput } from "@/ai/flows/code-solution-generator";
import { generateQuiz, type GenerateQuizInput } from "@/ai/flows/quiz-generator";
import { studyPlannerGenerator, type StudyPlannerInput } from "@/ai/flows/study-planner-generator";
import { examStrategyGenerator, type ExamStrategyInput } from "@/ai/flows/exam-strategy-generator";
import { db } from "@/lib/firebase";
import { doc, updateDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { QuizResult } from "@/types";

export async function runAiTutor(input: AiTutorInput) {
  const { answer } = await aiTutor(input);
  return answer;
}

export async function runCodeSolutionGenerator(input: CodeSolutionGeneratorInput, studentId: string) {
  const result = await codeSolutionGenerator(input);
  if (studentId) {
    const historyRef = collection(db, "students", studentId, "labSolutions");
    await addDoc(historyRef, {
      ...input,
      ...result,
      timestamp: serverTimestamp(),
    });
  }
  return result;
}

export async function runGenerateQuiz(input: GenerateQuizInput) {
  const { quiz } = await generateQuiz(input);
  return quiz;
}

export async function runStudyPlannerGenerator(input: StudyPlannerInput, studentId: string) {
  const result = await studyPlannerGenerator(input);
  if (studentId) {
    const historyRef = collection(db, "students", studentId, "studyPlanners");
    await addDoc(historyRef, {
      ...input,
      ...result,
      timestamp: serverTimestamp(),
    });
  }
  return result.dailyPlan;
}

export async function runExamStrategyGenerator(input: ExamStrategyInput, studentId: string) {
  const result = await examStrategyGenerator(input);
  if (studentId) {
    const historyRef = collection(db, "students", studentId, "examStrategies");
    await addDoc(historyRef, {
      ...input,
      ...result,
      timestamp: serverTimestamp(),
    });
  }
  return result;
}

export async function saveQuizResult(result: Omit<QuizResult, 'id' | 'timestamp'>, studentId: string) {
    const historyRef = collection(db, "students", studentId, "quizResults");
    await addDoc(historyRef, {
      ...result,
      timestamp: serverTimestamp(),
    });
}

export async function updateStudentProfile(studentId: string, data: { name?: string; email?: string; phone?: string; }) {
  const studentRef = doc(db, "students", studentId);
  await updateDoc(studentRef, data);
}