import { type Timestamp } from "firebase/firestore";

export interface User {
  uid: string;
  name: string;
  email?: string;
  roll?: string;
  code?: string;
  isAdmin: boolean;
}

export interface Student {
  id: string;
  roll: string;
  name: string;
  code: string;
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
  id: string;
  title: string;
  description: string;
  link: string;
}

export interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
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
