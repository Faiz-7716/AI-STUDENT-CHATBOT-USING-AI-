import { type Timestamp } from "firebase/firestore";

export interface User {
  uid: string;
  name: string;
  email?: string;
  phone?: string;
  roll?: string;
  code?: string;
  isAdmin: boolean;
  id?: string; // Student ID
}

export interface Student {
  id: string;
  roll: string;
  name: string;
  code: string;
  email?: string;
  phone?: string;
}

export interface Notification {
  id: string;
  message: string;
  timestamp: Timestamp;
}

export interface Note {
  id: string;
  title: string;
  link: string;
}

export interface NaanCourse {
  id: string;
  title: string;
  provider: string;
  semester: number;
  link: string;
}

export interface ExtraCourse {
  id:string;
  title: string;
  description: string;
  link: string;
}

export interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
  timestamp?: Timestamp;
}

export interface Conversation {
  id: string;
  title: string;
  timestamp: Timestamp;
}

export interface SyllabusCourse {
  title: string;
  category?: string;
  units?: string[];
  exercises?: string[];
  options?: string[];
}

export interface Syllabus {
  [semester: string]: {
    [courseCode: string]: SyllabusCourse;
  };
}


// --- New Types for Saved Content ---

export interface SavedExamStrategy {
    id: string;
    subject: string;
    likelyQuestions: string;
    revisionNotes: string;
    modelAnswer: string;
    timestamp: Timestamp;
}

export interface SavedLabSolution {
    id: string;
    exerciseDescription: string;
    codeSolution: string;
    explanation: string;
    timestamp: Timestamp;
}

export interface DailyPlan {
    day: string;
    plan: string;
}
  
export interface SavedStudyPlan {
    id: string;
    subjects: string[];
    dailyPlan: DailyPlan[];
    timestamp: Timestamp;
}

export interface QuizQuestion {
    question: string;
    options: { [key: string]: string };
    answer: string;
}
  
export interface ParsedQuiz {
    questions: QuizQuestion[];
    answerKey: { [key: number]: string };
}
  
export interface QuizResult {
    id: string;
    subject: string;
    score: number;
    total: number;
    percentage: number;
    correctAnswers: number;
    incorrectAnswers: number;
    timestamp: Timestamp;
}