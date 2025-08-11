"use server";

import { aiTutor, type AiTutorInput } from "@/ai/flows/ai-tutor";
import { codeSolutionGenerator, type CodeSolutionGeneratorInput } from "@/ai/flows/code-solution-generator";
import { generateQuiz, type GenerateQuizInput } from "@/ai/flows/quiz-generator";
import { studyPlannerGenerator, type StudyPlannerInput } from "@/ai/flows/study-planner-generator";
import { examStrategyGenerator, type ExamStrategyInput } from "@/ai/flows/exam-strategy-generator";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export async function runAiTutor(input: AiTutorInput) {
  const { answer } = await aiTutor(input);
  return answer;
}

export async function runCodeSolutionGenerator(input: CodeSolutionGeneratorInput) {
  const { codeSolution, explanation } = await codeSolutionGenerator(input);
  return { codeSolution, explanation };
}

export async function runGenerateQuiz(input: GenerateQuizInput) {
  const { quiz } = await generateQuiz(input);
  return quiz;
}

export async function runStudyPlannerGenerator(input: StudyPlannerInput) {
  const { dailyPlan } = await studyPlannerGenerator(input);
  return dailyPlan;
}

export async function runExamStrategyGenerator(input: ExamStrategyInput) {
  const { likelyQuestions, revisionNotes, modelAnswer } = await examStrategyGenerator(input);
  return { likelyQuestions, revisionNotes, modelAnswer };
}

export async function updateStudentProfile(studentId: string, data: { name?: string; email?: string; phone?: string; }) {
  const studentRef = doc(db, "students", studentId);
  await updateDoc(studentRef, data);
}
