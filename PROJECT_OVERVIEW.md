# FAIZAI - AI Student Chatbot Project Overview

## 🎓 Project Introduction

**FAIZAI** (formerly TutorAI) is a comprehensive AI-powered classroom assistant designed specifically for B.Sc. Computer Science students at Mazharul Uloom College. This Next.js application provides an intelligent tutoring system, study tools, and administrative features to enhance the learning experience.

**Developer:** Mohammed Faiz & AI  
**Technology Stack:** Next.js 15.3.3, React 18, TypeScript, Firebase, Google Genkit AI, Tailwind CSS

---

## 📋 Table of Contents

1. [Project Architecture](#project-architecture)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Core Features](#core-features)
5. [AI Integration](#ai-integration)
6. [Data Models](#data-models)
7. [Authentication & Authorization](#authentication--authorization)
8. [UI/UX Design](#uiux-design)
9. [Deployment](#deployment)
10. [Development Workflow](#development-workflow)

---

## 🏗️ Project Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Landing Page │  │ Login System │  │  Dashboard   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌───────────────────────────────────────────────────┐      │
│  │           Student Views (11 Features)              │      │
│  │  Chat | Quiz | Exam Strategy | Lab Assistant...   │      │
│  └───────────────────────────────────────────────────┘      │
│                                                               │
│  ┌───────────────────────────────────────────────────┐      │
│  │           Admin Views (8 Features)                 │      │
│  │  Setup | Students | Notifications | Syllabus...   │      │
│  └───────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                   Backend Services Layer                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │Server Actions│  │  AI Flows    │  │ Genkit AI    │      │
│  │(actions.ts)  │  │ (5 Modules)  │  │(Google AI)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer (Firebase)                     │
│  ┌──────────────┐  ┌──────────────┐                         │
│  │  Firestore   │  │Firebase Auth │                         │
│  │  (Database)  │  │ (Admin Only) │                         │
│  └──────────────┘  └──────────────┘                         │
└─────────────────────────────────────────────────────────────┘
```

### Application Flow

1. **Entry Point**: User lands on the marketing landing page (`/`)
2. **Authentication**: Students use roll number + access code; Admins use email/password
3. **Dashboard**: Role-based routing to student or admin dashboard
4. **Features**: Access to various AI-powered tools and management features
5. **Data Persistence**: All interactions saved to Firebase Firestore

---

## 🛠️ Technology Stack

### Frontend Framework
- **Next.js 15.3.3** - React framework with App Router
- **React 18.3.1** - UI library
- **TypeScript 5** - Type-safe development

### UI & Styling
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible UI components
- **Lucide React** - Icon library
- **shadcn/ui** - Re-usable component collection
- **Custom Design System**:
  - Primary Color: Muted Violet (#9466A7)
  - Background: Light Gray (#F0EFF2)
  - Accent: Deep Blue (#4A7E9F)
  - Font: Poppins (Google Fonts)

### AI & Machine Learning
- **Genkit 1.14.1** - AI development framework by Google
- **@genkit-ai/googleai 1.16.0** - Google AI plugin
- **Google Gemini 2.0 Flash** - LLM model (via API)

### Backend & Database
- **Firebase 11.9.1**:
  - Firestore - NoSQL database
  - Authentication - Admin login
- **Next.js Server Actions** - Server-side operations

### Development Tools
- **genkit-cli** - AI flow development and testing
- **ESLint** - Code linting
- **PostCSS** - CSS processing

---

## 📁 Project Structure

```
AI-STUDENT-CHATBOT-USING-AI-/
├── docs/
│   └── blueprint.md                    # Original project requirements
│
├── src/
│   ├── ai/                             # AI Integration Layer
│   │   ├── flows/                      # Genkit AI Flows
│   │   │   ├── ai-tutor.ts            # Conversational AI tutor
│   │   │   ├── code-solution-generator.ts  # Lab code generator
│   │   │   ├── exam-strategy-generator.ts  # Exam prep AI
│   │   │   ├── quiz-generator.ts      # Quiz creation AI
│   │   │   └── study-planner-generator.ts  # Study plan AI
│   │   ├── dev.ts                     # Genkit dev server entry
│   │   └── genkit.ts                  # Genkit configuration
│   │
│   ├── app/                            # Next.js App Router
│   │   ├── dashboard/
│   │   │   └── page.tsx               # Dashboard page
│   │   ├── login/
│   │   │   └── page.tsx               # Login page
│   │   ├── actions.ts                 # Server Actions
│   │   ├── globals.css                # Global styles
│   │   ├── layout.tsx                 # Root layout
│   │   └── page.tsx                   # Landing page
│   │
│   ├── components/                     # React Components
│   │   ├── ui/                        # shadcn/ui components (30+ components)
│   │   ├── views/                     # Feature Views
│   │   │   ├── admin/                 # Admin-only views (8 views)
│   │   │   │   ├── access-codes-view.tsx
│   │   │   │   ├── extra-courses-view.tsx
│   │   │   │   ├── naan-view.tsx
│   │   │   │   ├── notes-view.tsx
│   │   │   │   ├── notifications-view.tsx
│   │   │   │   ├── setup-view.tsx
│   │   │   │   ├── students-view.tsx
│   │   │   │   └── syllabus-view.tsx
│   │   │   ├── chat-view.tsx          # AI Chat interface
│   │   │   ├── exam-strategy-view.tsx
│   │   │   ├── extra-courses-view.tsx
│   │   │   ├── lab-assistant-view.tsx
│   │   │   ├── naan-view.tsx
│   │   │   ├── notes-view.tsx
│   │   │   ├── notifications-view.tsx
│   │   │   ├── profile-view.tsx
│   │   │   ├── quiz-generator-view.tsx
│   │   │   ├── study-planner-view.tsx
│   │   │   └── syllabus-browser-view.tsx
│   │   ├── dashboard.tsx              # Main dashboard component
│   │   └── theme-toggle.tsx           # Dark mode toggle
│   │
│   ├── hooks/                          # Custom React Hooks
│   │   ├── use-mobile.tsx             # Mobile detection
│   │   └── use-toast.ts               # Toast notifications
│   │
│   ├── lib/                            # Utility Libraries
│   │   ├── firebase.ts                # Firebase configuration
│   │   └── utils.ts                   # Helper functions
│   │
│   └── types/
│       └── index.ts                   # TypeScript type definitions
│
├── .gitignore                          # Git ignore rules
├── apphosting.yaml                     # Firebase App Hosting config
├── components.json                     # shadcn/ui config
├── next.config.ts                      # Next.js configuration
├── package.json                        # Dependencies
├── postcss.config.mjs                  # PostCSS config
├── tailwind.config.ts                  # Tailwind CSS config
└── tsconfig.json                       # TypeScript config
```

---

## ⚡ Core Features

### 🎯 Student Features (11 Total)

#### 1. **AI Tutor / Ask AI** (`chat-view.tsx`)
- **Purpose**: 24/7 conversational AI assistant
- **Capabilities**:
  - Context-aware of college syllabus
  - Real-time chat with conversation history
  - Multiple conversation threads
  - Saves chat history to Firestore
- **AI Flow**: `ai-tutor.ts`
- **Key Components**: Message threading, scroll management, conversation persistence

#### 2. **Quiz Generator** (`quiz-generator-view.tsx`)
- **Purpose**: Generate and take AI-powered quizzes
- **Capabilities**:
  - Create quizzes for any subject
  - Multiple choice questions
  - Immediate feedback
  - Score tracking and statistics
  - Quiz history with performance metrics
- **AI Flow**: `quiz-generator.ts`
- **Features**: Answer validation, progress tracking, result visualization with charts

#### 3. **Exam Strategy** (`exam-strategy-view.tsx`)
- **Purpose**: Exam preparation assistance
- **Capabilities**:
  - Generate 5 likely exam questions
  - Revision notes for key concepts
  - Model answers for practice
  - Save strategies for later review
- **AI Flow**: `exam-strategy-generator.ts`
- **Storage**: Saved to `students/{id}/examStrategies`

#### 4. **Lab Assistant** (`lab-assistant-view.tsx`)
- **Purpose**: Programming help for lab exercises
- **Capabilities**:
  - Generate code solutions (Python, C++, Java, SQL)
  - Code explanations
  - Debugging assistance
  - Save solutions for reference
- **AI Flow**: `code-solution-generator.ts`
- **Storage**: Saved to `students/{id}/labSolutions`

#### 5. **Study Planner** (`study-planner-view.tsx`)
- **Purpose**: Personalized study schedule generation
- **Capabilities**:
  - Create 7-day study plans
  - Multiple subject management
  - Day-wise breakdown
  - Save and view past plans
- **AI Flow**: `study-planner-generator.ts`
- **Storage**: Saved to `students/{id}/studyPlanners`

#### 6. **Syllabus Browser** (`syllabus-browser-view.tsx`)
- **Purpose**: Interactive syllabus exploration
- **Capabilities**:
  - Browse by semester (1-6)
  - View course details, units, exercises
  - Semester selection interface
- **Data Source**: Firestore `syllabus` collection

#### 7. **Notifications** (`notifications-view.tsx`)
- **Purpose**: View admin announcements
- **Capabilities**:
  - Real-time notification updates
  - Notification badge in sidebar
  - Chronological ordering
  - Auto-mark as read
- **Data Source**: Firestore `notifications` collection

#### 8. **Notes & Files** (`notes-view.tsx`)
- **Purpose**: Access course materials
- **Capabilities**:
  - View uploaded notes
  - Direct links to resources
  - Categorized listing
- **Data Source**: Firestore `notes` collection

#### 9. **Naan Mudhalvan** (`naan-view.tsx`)
- **Purpose**: Government course integration
- **Capabilities**:
  - View Naan Mudhalvan courses by semester
  - Provider information
  - Direct course links
- **Data Source**: Firestore `naanCourses` collection

#### 10. **Extra Courses** (`extra-courses-view.tsx`)
- **Purpose**: Additional learning resources
- **Capabilities**:
  - Browse supplementary courses
  - Course descriptions
  - External links
- **Data Source**: Firestore `extraCourses` collection

#### 11. **My Profile** (`profile-view.tsx`)
- **Purpose**: Student profile management
- **Capabilities**:
  - View roll number, name, access code
  - Edit contact information (email, phone)
  - Update profile
- **Storage**: Firestore `students/{id}` document

---

### 👨‍💼 Admin Features (8 Total)

#### 1. **Setup & Data** (`setup-view.tsx`)
- **Purpose**: Initial system setup
- **Capabilities**:
  - Bulk upload 30 students
  - Bulk upload syllabus data
  - One-time setup operation
- **Safety**: Prevents duplicate uploads

#### 2. **Students Management** (`students-view.tsx`)
- **Purpose**: Manage student database
- **Capabilities**:
  - View all students
  - Add new students individually
  - Edit student details
  - Delete students
  - Generate access codes
- **Data**: CRUD operations on `students` collection

#### 3. **Notifications Management** (`notifications-view.tsx`)
- **Purpose**: Push announcements to students
- **Capabilities**:
  - Create new notifications
  - View sent notifications
  - Delete notifications
- **Data**: CRUD operations on `notifications` collection

#### 4. **Notes Management** (`notes-view.tsx`)
- **Purpose**: Upload course materials
- **Capabilities**:
  - Add notes with titles and links
  - Edit existing notes
  - Delete notes
- **Data**: CRUD operations on `notes` collection

#### 5. **Syllabus Management** (`syllabus-view.tsx`)
- **Purpose**: Maintain curriculum data
- **Capabilities**:
  - Edit syllabus by semester
  - Update course details
  - JSON-based editing
- **Data**: Updates to `syllabus` collection

#### 6. **Naan Mudhalvan Management** (`naan-view.tsx`)
- **Purpose**: Manage government courses
- **Capabilities**:
  - Add Naan Mudhalvan courses
  - Edit course details
  - Delete courses
- **Data**: CRUD operations on `naanCourses` collection

#### 7. **Extra Courses Management** (`extra-courses-view.tsx`)
- **Purpose**: Manage supplementary courses
- **Capabilities**:
  - Add extra courses
  - Edit descriptions and links
  - Delete courses
- **Data**: CRUD operations on `extraCourses` collection

#### 8. **Access Codes Management** (`access-codes-view.tsx`)
- **Purpose**: View and manage student access codes
- **Capabilities**:
  - View all access codes
  - Search functionality
  - Code regeneration
- **Data**: Read from `students` collection

---

## 🤖 AI Integration

### Genkit AI Framework

The application uses **Google Genkit** for structured AI interactions:

```typescript
// Configuration (src/ai/genkit.ts)
export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    }),
  ],
  model: 'googleai/gemini-2.0-flash',
});
```

### AI Flows (5 Modules)

#### 1. **AI Tutor Flow** (`ai-tutor.ts`)
```typescript
Input:
- question: string (student's query)
- syllabus: string (curriculum context)
- studentName: string
- history: ChatMessage[] (conversation context)

Output:
- answer: string (AI-generated response)

Prompt Strategy:
- Friendly, encouraging personality
- Syllabus-aware responses
- Guides students to find answers
- Declines off-topic questions
```

#### 2. **Code Solution Generator** (`code-solution-generator.ts`)
```typescript
Input:
- exerciseDescription: string
- language: string (Python, C++, Java, SQL)

Output:
- codeSolution: string
- explanation: string

Approach:
- Generates working code
- Provides step-by-step explanation
- Focuses on clarity and correctness
```

#### 3. **Exam Strategy Generator** (`exam-strategy-generator.ts`)
```typescript
Input:
- subject: string

Output:
- likelyQuestions: string (5 questions)
- revisionNotes: string (key concepts)
- modelAnswer: string (detailed example)

Purpose:
- Exam preparation
- Strategic study guidance
```

#### 4. **Quiz Generator** (`quiz-generator.ts`)
```typescript
Input:
- subject: string
- numQuestions: number

Output:
- quiz: string (JSON formatted MCQs)

Format:
- Multiple choice questions
- 4 options per question
- Correct answer marked
```

#### 5. **Study Planner Generator** (`study-planner-generator.ts`)
```typescript
Input:
- subjects: string[]

Output:
- dailyPlan: DailyPlan[] (7 days)

Features:
- Balanced subject distribution
- Daily study recommendations
- Week-long planning
```

### Server Actions (`app/actions.ts`)

Bridge between frontend and AI flows:

```typescript
// Examples:
export async function runAiTutor(input: AiTutorInput)
export async function runCodeSolutionGenerator(input, studentId)
export async function runGenerateQuiz(input)
export async function runStudyPlannerGenerator(input, studentId)
export async function runExamStrategyGenerator(input, studentId)
```

All AI-generated content is automatically saved to Firestore for future reference.

---

## 📊 Data Models

### TypeScript Type Definitions (`src/types/index.ts`)

#### Core User Types

```typescript
interface User {
  uid: string;
  name: string;
  email?: string;
  phone?: string;
  roll?: string;
  code?: string;
  isAdmin: boolean;
  id?: string; // Student ID
}

interface Student {
  id: string;
  roll: string;
  name: string;
  code: string;
  email?: string;
  phone?: string;
}
```

#### Content Types

```typescript
interface Notification {
  id: string;
  message: string;
  timestamp: Timestamp;
}

interface Note {
  id: string;
  title: string;
  link: string;
}

interface NaanCourse {
  id: string;
  title: string;
  provider: string;
  semester: number;
  link: string;
}

interface ExtraCourse {
  id: string;
  title: string;
  description: string;
  link: string;
}
```

#### Chat & Conversation Types

```typescript
interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
  timestamp?: Timestamp;
}

interface Conversation {
  id: string;
  title: string;
  timestamp: Timestamp;
}
```

#### Syllabus Types

```typescript
interface SyllabusCourse {
  title: string;
  category?: string;
  units?: string[];
  exercises?: string[];
  options?: string[];
}

interface Syllabus {
  [semester: string]: {
    [courseCode: string]: SyllabusCourse;
  };
}
```

#### Saved AI Content Types

```typescript
interface SavedExamStrategy {
  id: string;
  subject: string;
  likelyQuestions: string;
  revisionNotes: string;
  modelAnswer: string;
  timestamp: Timestamp;
}

interface SavedLabSolution {
  id: string;
  exerciseDescription: string;
  codeSolution: string;
  explanation: string;
  timestamp: Timestamp;
}

interface DailyPlan {
  day: string;
  plan: string;
}

interface SavedStudyPlan {
  id: string;
  subjects: string[];
  dailyPlan: DailyPlan[];
  timestamp: Timestamp;
}
```

#### Quiz Types

```typescript
interface QuizQuestion {
  question: string;
  options: { [key: string]: string };
  answer: string;
}

interface ParsedQuiz {
  questions: QuizQuestion[];
  answerKey: { [key: number]: string };
}

interface QuizResult {
  id: string;
  subject: string;
  score: number;
  total: number;
  percentage: number;
  correctAnswers: number;
  incorrectAnswers: number;
  timestamp: Timestamp;
}
```

### Firestore Database Structure

```
firestore/
├── students/                           # Student collection
│   └── {studentId}/
│       ├── conversations/              # Chat conversations
│       │   └── {conversationId}/
│       │       ├── title: string
│       │       ├── timestamp: Timestamp
│       │       └── messages/           # Chat messages
│       │           └── {messageId}/
│       │               ├── role: "user" | "model"
│       │               ├── parts: [{text: string}]
│       │               └── timestamp: Timestamp
│       ├── examStrategies/             # Saved exam strategies
│       │   └── {strategyId}/
│       ├── labSolutions/               # Saved lab solutions
│       │   └── {solutionId}/
│       ├── studyPlanners/              # Saved study plans
│       │   └── {plannerId}/
│       └── quizResults/                # Quiz results
│           └── {resultId}/
│
├── notifications/                      # Global notifications
│   └── {notificationId}/
│       ├── message: string
│       └── timestamp: Timestamp
│
├── notes/                              # Course notes
│   └── {noteId}/
│       ├── title: string
│       └── link: string
│
├── syllabus/                           # Syllabus by semester
│   └── {semesterName}/                 # e.g., "Semester 1"
│       └── {courseCode}/               # e.g., "CC1"
│           ├── title: string
│           ├── category?: string
│           ├── units?: string[]
│           ├── exercises?: string[]
│           └── options?: string[]
│
├── naanCourses/                        # Naan Mudhalvan courses
│   └── {courseId}/
│       ├── title: string
│       ├── provider: string
│       ├── semester: number
│       └── link: string
│
└── extraCourses/                       # Extra courses
    └── {courseId}/
        ├── title: string
        ├── description: string
        └── link: string
```

---

## 🔐 Authentication & Authorization

### Student Authentication
- **Method**: Custom authentication via Firestore
- **Credentials**: Roll Number + Access Code
- **Process**:
  1. Query `students` collection by roll number
  2. Verify access code matches
  3. Store user data in `sessionStorage`
  4. Redirect to dashboard

### Admin Authentication
- **Method**: Firebase Authentication (Email/Password)
- **Credentials**: Email + Password
- **Process**:
  1. Use `signInWithEmailAndPassword()`
  2. Store admin user in `sessionStorage`
  3. Redirect to admin dashboard

### Session Management
- **Storage**: `sessionStorage` (client-side)
- **Data Stored**: 
  ```typescript
  {
    uid/id: string,
    name: string,
    email?: string,
    roll?: string,
    code?: string,
    isAdmin: boolean
  }
  ```
- **Persistence**: Session-based (cleared on browser close)
- **Protection**: Server actions validate user context

### Role-Based Access Control
- **Student Role**: Access to 11 student features
- **Admin Role**: Access to 8 admin features
- **UI Routing**: Dashboard component conditionally renders based on `user.isAdmin`

---

## 🎨 UI/UX Design

### Design System

#### Color Palette
```css
/* From blueprint.md */
--primary: Muted Violet (#9466A7)
--background: Light Gray (#F0EFF2)
--accent: Deep Blue (#4A7E9F)
```

#### Typography
- **Font Family**: Poppins (sans-serif)
- **Loaded From**: Google Fonts
- **Usage**: Body, headlines, and UI elements

#### Component Library
- **Base**: shadcn/ui (Radix UI + Tailwind)
- **30+ UI Components**: Button, Card, Dialog, Form elements, etc.
- **Icons**: Lucide React (Feather Icons style)
- **Theme**: Light/Dark mode support via `theme-toggle.tsx`

### Layout Structure

#### Landing Page (`app/page.tsx`)
- **Sections**:
  - Hero with statistics
  - Features showcase
  - Testimonials
  - FAQ (Accordion)
  - Call-to-action
  - Footer with contact info

#### Login Page (`app/login/page.tsx`)
- **Features**:
  - Toggle between student/admin login
  - Password visibility toggle
  - Form validation
  - Animated gradient background

#### Dashboard (`components/dashboard.tsx`)
- **Layout**: Sidebar + Content area
- **Navigation**: 
  - Collapsible sidebar with icon + label
  - Mobile-responsive with hamburger menu
  - Badge notifications on notification item
- **Header**: 
  - User avatar and info
  - Theme toggle
  - Logout button

### Responsive Design
- **Mobile-First**: Tailwind's responsive utilities
- **Breakpoints**: sm, md, lg, xl, 2xl
- **Mobile Detection**: Custom `use-mobile.tsx` hook
- **Adaptations**: Sidebar collapses, sheet overlays for mobile

### Animations & Interactions
- **Smooth Transitions**: Tailwind's `transition-all`
- **Hover Effects**: Subtle scale and shadow changes
- **Loading States**: Skeleton loaders, loading text
- **Toast Notifications**: Non-intrusive feedback via `use-toast`
- **Animated Gradient**: CSS animation on landing/login pages

---

## 🚀 Deployment

### Hosting Platform
- **Service**: Firebase App Hosting
- **Configuration**: `apphosting.yaml`
  ```yaml
  runConfig:
    maxInstances: 1
  ```

### Build Configuration
- **Framework**: Next.js 15 (App Router)
- **Build Command**: `npm run build`
- **Output**: Static + Server-rendered pages
- **Deployment**: Managed by Firebase CLI

### Environment Variables Required
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=<your-api-key>

# Google Gemini AI
NEXT_PUBLIC_GEMINI_API_KEY=<your-gemini-api-key>
```

### Firebase Services Setup
1. **Firestore Database**: 
   - Create collections: `students`, `notifications`, `notes`, `syllabus`, `naanCourses`, `extraCourses`
   - Set security rules for read/write access

2. **Firebase Authentication**:
   - Enable Email/Password authentication
   - Create admin user account

3. **Firebase App Hosting**:
   - Connect GitHub repository
   - Configure build settings
   - Deploy

---

## 💻 Development Workflow

### Prerequisites
- Node.js 20+
- npm or yarn
- Firebase account
- Google AI API key

### Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/Faiz-7716/AI-STUDENT-CHATBOT-USING-AI-.git
cd AI-STUDENT-CHATBOT-USING-AI-

# 2. Install dependencies
npm install

# 3. Set up environment variables
# Create .env.local file with:
# NEXT_PUBLIC_FIREBASE_API_KEY=your-key
# NEXT_PUBLIC_GEMINI_API_KEY=your-key

# 4. Run development server
npm run dev
# Opens on http://localhost:9002

# 5. (Optional) Run Genkit dev server for AI testing
npm run genkit:dev
# Opens Genkit UI for testing AI flows
```

### Available Scripts

```json
{
  "dev": "next dev --turbopack -p 9002",
  "genkit:dev": "genkit start -- tsx src/ai/dev.ts",
  "genkit:watch": "genkit start -- tsx --watch src/ai/dev.ts",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "typecheck": "tsc --noEmit"
}
```

### Development Tools

#### Genkit Dev UI
- **Purpose**: Test and debug AI flows
- **Access**: Run `npm run genkit:dev`
- **Features**:
  - Flow visualization
  - Input/output testing
  - Trace inspection
  - Model configuration

#### Type Safety
- **TypeScript**: Strict mode enabled
- **Type Checking**: `npm run typecheck`
- **IDE Integration**: VSCode with TypeScript

#### Code Quality
- **Linting**: ESLint with Next.js config
- **Command**: `npm run lint`
- **Auto-fix**: ESLint can fix many issues automatically

### Build & Deploy

```bash
# 1. Type check
npm run typecheck

# 2. Lint code
npm run lint

# 3. Build for production
npm run build

# 4. Test production build locally
npm run start

# 5. Deploy to Firebase
firebase deploy
```

---

## 📈 Key Statistics

### Codebase Metrics
- **Total Files**: ~100+ TypeScript/TSX files
- **Lines of Code**:
  - AI Flows: ~324 lines (5 files)
  - Views: ~1,711 lines (11 student + 8 admin views)
  - Components: 30+ UI components
- **Dependencies**: 56 npm packages
- **Dev Dependencies**: 7 packages

### Feature Count
- **Student Features**: 11
- **Admin Features**: 8
- **AI Flows**: 5
- **UI Components**: 30+
- **Database Collections**: 7 main collections

### Supported Users
- **Students**: 30 B.Sc. CS students (initial setup)
- **Admins**: Multiple admin accounts via Firebase Auth
- **Semesters**: 6 (covering 3-year B.Sc. program)

---

## 🔑 Key Design Decisions

### 1. **Why Next.js App Router?**
- Server-side rendering for better SEO on landing page
- Server Actions for secure AI operations
- Built-in routing and API handling
- Excellent TypeScript support

### 2. **Why Genkit for AI?**
- Structured AI workflows with type safety
- Built-in tracing and debugging
- Easy model switching
- Integration with Google AI

### 3. **Why Firebase?**
- Real-time database for notifications
- Simple authentication setup
- Scalable serverless infrastructure
- Easy deployment with App Hosting

### 4. **Why sessionStorage over localStorage?**
- Better security (cleared on browser close)
- Prevents persistent login across sessions
- Suitable for academic environment

### 5. **Why Custom Student Auth?**
- No email requirement for students
- Simple roll number + code system
- Easy distribution of access codes
- Suitable for college environment

### 6. **Why Separate Admin Portal?**
- Clear separation of concerns
- Different UI/UX needs
- Enhanced security for admin operations
- Easier to manage permissions

---

## 🧩 Integration Points

### External Services
1. **Google Gemini API**: AI model backend
2. **Firebase Services**: Database, Auth, Hosting
3. **Google Fonts**: Poppins font family

### Internal Integrations
1. **AI Flows ↔ Server Actions**: Type-safe AI invocation
2. **Server Actions ↔ Firestore**: Data persistence
3. **Views ↔ Firebase**: Real-time data subscriptions
4. **Dashboard ↔ Views**: Component composition

---

## 📚 Learning Resources

### For Students Using FAIZAI
- Use the AI Tutor for 24/7 help
- Generate quizzes to test knowledge
- Review exam strategies before tests
- Get lab help with code explanations

### For Developers
- **Next.js Docs**: https://nextjs.org/docs
- **Genkit Docs**: https://firebase.google.com/docs/genkit
- **Firebase Docs**: https://firebase.google.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com

---

## 🎯 Future Enhancement Possibilities

1. **Performance Tracking**: Analytics dashboard for student progress
2. **Peer Collaboration**: Study groups and peer chat
3. **Video Tutorials**: Integration with video content
4. **Mobile App**: React Native companion app
5. **Advanced AI**: Fine-tuned models on college curriculum
6. **Gamification**: Points, badges, leaderboards
7. **Offline Mode**: PWA capabilities
8. **Multi-Language**: Support for regional languages
9. **Voice Input**: Voice-to-text for queries
10. **Export Features**: PDF generation for study materials

---

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

### Code Style
- Follow TypeScript best practices
- Use Prettier for formatting
- Write meaningful commit messages
- Document complex logic

---

## 📝 License & Credits

**Developed by**: Mohammed Faiz & AI  
**Institution**: Mazharul Uloom College  
**Purpose**: Educational tool for B.Sc. Computer Science students  
**Year**: 2025

---

## 🆘 Support & Contact

**Email**: support@faizai.com  
**Phone**: +91 12345 67890  

For technical issues, please refer to the application's FAQ section or contact the administrator.

---

**Last Updated**: December 2025  
**Document Version**: 1.0  
**Project Status**: ✅ Active Development
