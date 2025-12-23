# FAIZAI - Technical Architecture Documentation

## 🏛️ System Architecture Overview

This document provides a deep dive into the technical architecture of the FAIZAI AI Student Chatbot application.

---

## Table of Contents

1. [Architecture Layers](#architecture-layers)
2. [Component Interactions](#component-interactions)
3. [Data Flow Diagrams](#data-flow-diagrams)
4. [AI Pipeline](#ai-pipeline)
5. [Security Architecture](#security-architecture)
6. [Performance Considerations](#performance-considerations)

---

## 1. Architecture Layers

### Layer 1: Presentation Layer (Client-Side)

```
┌───────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                          │
│                    (Client-Side React)                         │
├───────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │  Landing    │  │   Login     │  │  Dashboard  │           │
│  │   Page      │  │   System    │  │   Layout    │           │
│  │             │  │             │  │             │           │
│  │ - Hero      │  │ - Student   │  │ - Sidebar   │           │
│  │ - Features  │  │ - Admin     │  │ - Header    │           │
│  │ - FAQ       │  │ - Toggle    │  │ - Content   │           │
│  └─────────────┘  └─────────────┘  └─────────────┘           │
│                                                                 │
│  ┌────────────────────────────────────────────────────┐       │
│  │           Student View Components (11)              │       │
│  ├────────────────────────────────────────────────────┤       │
│  │ ChatView | QuizView | ExamStrategyView | LabView   │       │
│  │ StudyPlannerView | SyllabusView | NotesView         │       │
│  │ NotificationsView | ProfileView | NaanView          │       │
│  │ ExtraCoursesView                                    │       │
│  └────────────────────────────────────────────────────┘       │
│                                                                 │
│  ┌────────────────────────────────────────────────────┐       │
│  │            Admin View Components (8)                │       │
│  ├────────────────────────────────────────────────────┤       │
│  │ SetupView | StudentsView | NotificationsView        │       │
│  │ NotesView | SyllabusView | NaanView                 │       │
│  │ ExtraCoursesView | AccessCodesView                  │       │
│  └────────────────────────────────────────────────────┘       │
│                                                                 │
│  ┌────────────────────────────────────────────────────┐       │
│  │         UI Component Library (shadcn/ui)            │       │
│  ├────────────────────────────────────────────────────┤       │
│  │ Button | Card | Dialog | Input | Select | Table    │       │
│  │ Accordion | Alert | Avatar | Badge | Checkbox       │       │
│  │ ScrollArea | Sheet | Skeleton | Toast | Tooltip    │       │
│  │ ... and 18+ more components                         │       │
│  └────────────────────────────────────────────────────┘       │
│                                                                 │
└───────────────────────────────────────────────────────────────┘
```

**Key Characteristics:**
- **Framework**: Next.js 15 (React 18)
- **Rendering**: Hybrid (SSR for landing, CSR for dashboard)
- **State Management**: React Hooks (useState, useEffect)
- **Styling**: Tailwind CSS + CSS Modules
- **Type Safety**: TypeScript strict mode

---

### Layer 2: Application Logic Layer (Server-Side)

```
┌───────────────────────────────────────────────────────────────┐
│                  APPLICATION LOGIC LAYER                       │
│                  (Next.js Server Actions)                      │
├───────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────┐      │
│  │         Server Actions (app/actions.ts)              │      │
│  ├─────────────────────────────────────────────────────┤      │
│  │                                                       │      │
│  │  runAiTutor(input: AiTutorInput)                     │      │
│  │    ├─> Calls aiTutor flow                            │      │
│  │    └─> Returns AI response                           │      │
│  │                                                       │      │
│  │  runCodeSolutionGenerator(input, studentId)          │      │
│  │    ├─> Calls codeSolutionGenerator flow              │      │
│  │    ├─> Saves to Firestore                            │      │
│  │    └─> Returns code + explanation                    │      │
│  │                                                       │      │
│  │  runGenerateQuiz(input: GenerateQuizInput)           │      │
│  │    ├─> Calls generateQuiz flow                       │      │
│  │    └─> Returns quiz JSON                             │      │
│  │                                                       │      │
│  │  runStudyPlannerGenerator(input, studentId)          │      │
│  │    ├─> Calls studyPlannerGenerator flow              │      │
│  │    ├─> Saves to Firestore                            │      │
│  │    └─> Returns daily plan                            │      │
│  │                                                       │      │
│  │  runExamStrategyGenerator(input, studentId)          │      │
│  │    ├─> Calls examStrategyGenerator flow              │      │
│  │    ├─> Saves to Firestore                            │      │
│  │    └─> Returns strategy data                         │      │
│  │                                                       │      │
│  │  saveQuizResult(result, studentId)                   │      │
│  │    └─> Saves quiz result to Firestore                │      │
│  │                                                       │      │
│  │  updateStudentProfile(studentId, data)               │      │
│  │    └─> Updates student document                      │      │
│  │                                                       │      │
│  └─────────────────────────────────────────────────────┘      │
│                                                                 │
└───────────────────────────────────────────────────────────────┘
```

**Key Characteristics:**
- **Paradigm**: Server Actions (Next.js 13+)
- **Security**: Server-side execution only
- **Type Safety**: TypeScript interfaces for all I/O
- **Error Handling**: Try-catch with user-friendly messages

---

### Layer 3: AI Processing Layer (Genkit)

```
┌───────────────────────────────────────────────────────────────┐
│                    AI PROCESSING LAYER                         │
│                   (Genkit AI Framework)                        │
├───────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────┐      │
│  │              Genkit Configuration                    │      │
│  │              (src/ai/genkit.ts)                      │      │
│  ├─────────────────────────────────────────────────────┤      │
│  │                                                       │      │
│  │  const ai = genkit({                                 │      │
│  │    plugins: [googleAI({ apiKey })],                  │      │
│  │    model: 'googleai/gemini-2.0-flash'                │      │
│  │  })                                                   │      │
│  │                                                       │      │
│  └─────────────────────────────────────────────────────┘      │
│                                                                 │
│  ┌─────────────────────────────────────────────────────┐      │
│  │                 AI Flows (5 Modules)                 │      │
│  ├─────────────────────────────────────────────────────┤      │
│  │                                                       │      │
│  │  1. ai-tutor.ts                                      │      │
│  │     ├─ Input: question, syllabus, history, name      │      │
│  │     ├─ Prompt: Friendly tutor, syllabus-aware        │      │
│  │     └─ Output: answer (string)                       │      │
│  │                                                       │      │
│  │  2. code-solution-generator.ts                       │      │
│  │     ├─ Input: exerciseDescription, language          │      │
│  │     ├─ Prompt: Generate working code                 │      │
│  │     └─ Output: codeSolution, explanation             │      │
│  │                                                       │      │
│  │  3. exam-strategy-generator.ts                       │      │
│  │     ├─ Input: subject                                │      │
│  │     ├─ Prompt: Generate exam prep materials          │      │
│  │     └─ Output: questions, notes, modelAnswer         │      │
│  │                                                       │      │
│  │  4. quiz-generator.ts                                │      │
│  │     ├─ Input: subject, numQuestions                  │      │
│  │     ├─ Prompt: Create MCQs in JSON format            │      │
│  │     └─ Output: quiz (JSON string)                    │      │
│  │                                                       │      │
│  │  5. study-planner-generator.ts                       │      │
│  │     ├─ Input: subjects (array)                       │      │
│  │     ├─ Prompt: Create 7-day balanced plan            │      │
│  │     └─ Output: dailyPlan (array)                     │      │
│  │                                                       │      │
│  └─────────────────────────────────────────────────────┘      │
│                                                                 │
│  ┌─────────────────────────────────────────────────────┐      │
│  │            Flow Execution Pipeline                   │      │
│  ├─────────────────────────────────────────────────────┤      │
│  │                                                       │      │
│  │  Input → Schema Validation → Prompt Construction     │      │
│  │    → Model Invocation → Output Parsing               │      │
│  │    → Schema Validation → Return                      │      │
│  │                                                       │      │
│  └─────────────────────────────────────────────────────┘      │
│                                                                 │
└───────────────────────────────────────────────────────────────┘
```

**Key Characteristics:**
- **Framework**: Google Genkit
- **Model**: Gemini 2.0 Flash (fast, efficient)
- **Type Safety**: Zod schema validation
- **Tracing**: Built-in flow tracing for debugging
- **Prompting**: Handlebars templates with context

---

### Layer 4: Data Persistence Layer (Firebase)

```
┌───────────────────────────────────────────────────────────────┐
│                  DATA PERSISTENCE LAYER                        │
│                   (Firebase Services)                          │
├───────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────┐      │
│  │          Firebase Authentication                     │      │
│  ├─────────────────────────────────────────────────────┤      │
│  │  - Email/Password auth for admins                    │      │
│  │  - No SDK auth for students (Firestore check)        │      │
│  └─────────────────────────────────────────────────────┘      │
│                                                                 │
│  ┌─────────────────────────────────────────────────────┐      │
│  │            Firestore Database                        │      │
│  ├─────────────────────────────────────────────────────┤      │
│  │                                                       │      │
│  │  Root Collections:                                   │      │
│  │  ├─ students/                                        │      │
│  │  │   └─ {studentId}/                                 │      │
│  │  │       ├─ conversations/                           │      │
│  │  │       │   └─ {convId}/messages/                   │      │
│  │  │       ├─ examStrategies/                          │      │
│  │  │       ├─ labSolutions/                            │      │
│  │  │       ├─ studyPlanners/                           │      │
│  │  │       └─ quizResults/                             │      │
│  │  │                                                    │      │
│  │  ├─ notifications/                                   │      │
│  │  │   └─ {notificationId}                             │      │
│  │  │                                                    │      │
│  │  ├─ notes/                                           │      │
│  │  │   └─ {noteId}                                     │      │
│  │  │                                                    │      │
│  │  ├─ syllabus/                                        │      │
│  │  │   └─ {semesterName}/                              │      │
│  │  │       └─ {courseCode}                             │      │
│  │  │                                                    │      │
│  │  ├─ naanCourses/                                     │      │
│  │  │   └─ {courseId}                                   │      │
│  │  │                                                    │      │
│  │  └─ extraCourses/                                    │      │
│  │      └─ {courseId}                                   │      │
│  │                                                       │      │
│  └─────────────────────────────────────────────────────┘      │
│                                                                 │
└───────────────────────────────────────────────────────────────┘
```

**Key Characteristics:**
- **Database**: Cloud Firestore (NoSQL)
- **Real-time**: Live listeners for notifications
- **Security**: Firestore security rules
- **Scalability**: Auto-scaling with usage
- **Indexing**: Composite indexes for queries

---

## 2. Component Interactions

### Student Chat Flow (Detailed)

```
┌──────────────┐
│   Student    │
│   Types in   │
│   ChatView   │
└──────┬───────┘
       │
       │ 1. User types question
       ↓
┌──────────────────────────────────────┐
│  ChatView Component State            │
│  - messages: ChatMessage[]            │
│  - input: string                      │
│  - activeConversationId: string       │
└──────┬───────────────────────────────┘
       │
       │ 2. handleSendMessage()
       ↓
┌──────────────────────────────────────┐
│  Firestore Operations (Client)       │
│  - Add user message to messages/     │
│  - Create conversation if new         │
└──────┬───────────────────────────────┘
       │
       │ 3. Call Server Action
       ↓
┌──────────────────────────────────────┐
│  runAiTutor(input)                   │
│  - question: string                   │
│  - syllabus: string                   │
│  - history: ChatMessage[]             │
│  - studentName: string                │
└──────┬───────────────────────────────┘
       │
       │ 4. Execute AI Flow
       ↓
┌──────────────────────────────────────┐
│  aiTutor Flow (Genkit)               │
│  - Validate input schema              │
│  - Construct prompt with context      │
│  - Call Gemini 2.0 Flash              │
│  - Parse and validate output          │
└──────┬───────────────────────────────┘
       │
       │ 5. Return answer
       ↓
┌──────────────────────────────────────┐
│  Server Action returns string         │
└──────┬───────────────────────────────┘
       │
       │ 6. Save AI response
       ↓
┌──────────────────────────────────────┐
│  Firestore Operations (Client)       │
│  - Add model message to messages/    │
└──────┬───────────────────────────────┘
       │
       │ 7. Real-time update
       ↓
┌──────────────────────────────────────┐
│  onSnapshot listener fires            │
│  - Update messages state              │
│  - Re-render chat UI                  │
└──────┬───────────────────────────────┘
       │
       │ 8. Display AI response
       ↓
┌──────────────┐
│   Student    │
│  Sees Reply  │
└──────────────┘
```

### Admin Student Management Flow

```
┌──────────────┐
│    Admin     │
│   Adds New   │
│   Student    │
└──────┬───────┘
       │
       │ 1. Fill form in StudentsView
       ↓
┌──────────────────────────────────────┐
│  Form Validation (Client)            │
│  - Check required fields              │
│  - Validate roll number format        │
└──────┬───────────────────────────────┘
       │
       │ 2. handleAddStudent()
       ↓
┌──────────────────────────────────────┐
│  Generate Access Code                │
│  - Format: CS25-XXX-YY                │
└──────┬───────────────────────────────┘
       │
       │ 3. Firestore Write
       ↓
┌──────────────────────────────────────┐
│  addDoc(collection(db, "students"))  │
│  - roll, name, code, email, phone     │
└──────┬───────────────────────────────┘
       │
       │ 4. Success callback
       ↓
┌──────────────────────────────────────┐
│  UI Update                            │
│  - Toast notification                 │
│  - Refresh student list               │
└──────┬───────────────────────────────┘
       │
       │ 5. Confirmation
       ↓
┌──────────────┐
│    Admin     │
│  Sees New    │
│   Student    │
└──────────────┘
```

### Quiz Generation & Taking Flow

```
┌──────────────┐
│   Student    │
│  Generates   │
│    Quiz      │
└──────┬───────┘
       │
       │ 1. Input subject & question count
       ↓
┌──────────────────────────────────────┐
│  QuizGeneratorView                   │
│  - subject: string                    │
│  - numQuestions: number               │
└──────┬───────────────────────────────┘
       │
       │ 2. handleGenerateQuiz()
       ↓
┌──────────────────────────────────────┐
│  runGenerateQuiz(input)              │
└──────┬───────────────────────────────┘
       │
       │ 3. AI generates quiz
       ↓
┌──────────────────────────────────────┐
│  generateQuiz Flow                   │
│  - Returns JSON string                │
└──────┬───────────────────────────────┘
       │
       │ 4. Parse quiz JSON
       ↓
┌──────────────────────────────────────┐
│  parseQuizData(quizText)             │
│  - Extract questions, options, answers│
└──────┬───────────────────────────────┘
       │
       │ 5. Display quiz interface
       ↓
┌──────────────────────────────────────┐
│  Quiz UI Render                      │
│  - Show questions one by one          │
│  - Radio buttons for options          │
│  - Next/Previous navigation           │
└──────┬───────────────────────────────┘
       │
       │ 6. Student answers questions
       ↓
┌──────────────────────────────────────┐
│  Track Answers                       │
│  - userAnswers: { [key]: string }     │
└──────┬───────────────────────────────┘
       │
       │ 7. Submit quiz
       ↓
┌──────────────────────────────────────┐
│  Calculate Score                     │
│  - Compare with answer key            │
│  - Count correct/incorrect            │
│  - Calculate percentage               │
└──────┬───────────────────────────────┘
       │
       │ 8. Save result
       ↓
┌──────────────────────────────────────┐
│  saveQuizResult(result, studentId)   │
│  - Save to quizResults/               │
└──────┬───────────────────────────────┘
       │
       │ 9. Display results
       ↓
┌──────────────────────────────────────┐
│  Results UI with Charts              │
│  - Score, percentage                  │
│  - Correct/incorrect breakdown        │
│  - Bar chart visualization            │
└──────┬───────────────────────────────┘
       │
       │ 10. Review answers
       ↓
┌──────────────┐
│   Student    │
│  Sees Score  │
│  & Learns    │
└──────────────┘
```

---

## 3. Data Flow Diagrams

### Authentication Data Flow

```
┌─────────────────┐
│  Login Page     │
└────────┬────────┘
         │
         ├─── Student Path ───┐
         │                    │
         │                    ↓
         │         ┌──────────────────────┐
         │         │ Query Firestore      │
         │         │ students collection  │
         │         └──────────┬───────────┘
         │                    │
         │                    ↓
         │         ┌──────────────────────┐
         │         │ Verify roll + code   │
         │         └──────────┬───────────┘
         │                    │
         │                    ↓
         │         ┌──────────────────────┐
         │         │ Store in             │
         │         │ sessionStorage       │
         │         └──────────┬───────────┘
         │                    │
         │                    └──────────┐
         │                               │
         └─── Admin Path ────┐           │
                             │           │
                             ↓           │
                  ┌──────────────────────┐
                  │ Firebase Auth        │
                  │ Email/Password       │
                  └──────────┬───────────┘
                             │
                             ↓
                  ┌──────────────────────┐
                  │ Get user credentials │
                  └──────────┬───────────┘
                             │
                             ↓
                  ┌──────────────────────┐
                  │ Store in             │
                  │ sessionStorage       │
                  └──────────┬───────────┘
                             │
                             │
         ┌───────────────────┴───────────┐
         │                               │
         ↓                               ↓
┌─────────────────┐           ┌─────────────────┐
│ Student         │           │ Admin           │
│ Dashboard       │           │ Dashboard       │
└─────────────────┘           └─────────────────┘
```

### Real-time Notification Flow

```
┌─────────────────┐
│  Admin Portal   │
│  Creates New    │
│  Notification   │
└────────┬────────┘
         │
         │ addDoc()
         ↓
┌──────────────────────────────┐
│  Firestore                   │
│  notifications/              │
│  {id}: {                     │
│    message: string,          │
│    timestamp: Timestamp      │
│  }                           │
└────────┬─────────────────────┘
         │
         │ Real-time listener fires
         ↓
┌──────────────────────────────┐
│  All Student Clients         │
│  onSnapshot() triggered      │
└────────┬─────────────────────┘
         │
         │ Filter by timestamp
         ↓
┌──────────────────────────────┐
│  Check lastCheckedTime       │
│  Count new notifications     │
└────────┬─────────────────────┘
         │
         │ Update badge
         ↓
┌──────────────────────────────┐
│  Sidebar MenuItem            │
│  Shows badge with count      │
└────────┬─────────────────────┘
         │
         │ Student clicks
         ↓
┌──────────────────────────────┐
│  NotificationsView           │
│  - Display all notifications │
│  - Mark as read (update time)│
│  - Clear badge               │
└──────────────────────────────┘
```

---

## 4. AI Pipeline

### Genkit Flow Execution Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│                    AI FLOW EXECUTION                         │
└─────────────────────────────────────────────────────────────┘

1. Input Received from Server Action
   ↓
   ┌──────────────────────────────┐
   │  Input Schema Validation     │
   │  (Zod schema check)          │
   └────────────┬─────────────────┘
                │
                ↓ Valid
                
2. Prompt Construction
   ↓
   ┌──────────────────────────────┐
   │  definePrompt()              │
   │  - Template: Handlebars      │
   │  - Input vars: {{{var}}}     │
   │  - System instructions       │
   └────────────┬─────────────────┘
                │
                ↓
                
3. Context Enrichment
   ↓
   ┌──────────────────────────────┐
   │  Add Context Data            │
   │  - Syllabus content          │
   │  - Conversation history      │
   │  - Student metadata          │
   └────────────┬─────────────────┘
                │
                ↓
                
4. Model Invocation
   ↓
   ┌──────────────────────────────┐
   │  Google Gemini 2.0 Flash     │
   │  - Send prompt               │
   │  - Configure parameters      │
   │  - Await response            │
   └────────────┬─────────────────┘
                │
                ↓
                
5. Response Parsing
   ↓
   ┌──────────────────────────────┐
   │  Extract Output              │
   │  - Parse text/JSON           │
   │  - Clean formatting          │
   └────────────┬─────────────────┘
                │
                ↓
                
6. Output Schema Validation
   ↓
   ┌──────────────────────────────┐
   │  Output Schema Check         │
   │  (Zod schema validation)     │
   └────────────┬─────────────────┘
                │
                ↓ Valid
                
7. Return to Server Action
   ↓
   ┌──────────────────────────────┐
   │  Structured Output           │
   │  - Type-safe response        │
   │  - Ready for client          │
   └──────────────────────────────┘
```

### Prompt Engineering Strategy

Each AI flow uses carefully crafted prompts:

#### AI Tutor Prompt Structure
```
System Role:
- You are a friendly AI Classroom Assistant
- Name: Personalized to student
- Personality: Encouraging, professional

Guidelines:
- Prioritize syllabus content
- Provide clear, simple explanations
- Guide rather than give direct answers
- Politely decline off-topic questions

Context:
- Syllabus Content: {{{syllabus}}}
- Conversation History: {{#each history}}...{{/each}}

Query:
- Student Question: {{{question}}}
```

#### Code Solution Prompt Structure
```
System Role:
- You are a coding assistant for lab exercises

Task:
- Generate working code in {{{language}}}
- Provide step-by-step explanation

Requirements:
- Correct, runnable code
- Clear comments
- Educational explanations

Input:
- Exercise: {{{exerciseDescription}}}
```

---

## 5. Security Architecture

### Authentication Security

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                           │
└─────────────────────────────────────────────────────────────┘

Layer 1: Student Authentication
─────────────────────────────────
- No passwords stored
- Access codes act as shared secrets
- Roll numbers are semi-public identifiers
- Session-based (sessionStorage)
- Auto-logout on browser close

Security Controls:
✓ Input validation (trim, sanitize)
✓ Firestore query limiting
✓ No SQL injection (NoSQL database)
✗ No rate limiting (room for improvement)
✗ No brute force protection (room for improvement)

Layer 2: Admin Authentication
─────────────────────────────
- Firebase Authentication (email/password)
- Strong password requirements
- Session-based (sessionStorage)
- Admin-only Firebase rules

Security Controls:
✓ Firebase Auth built-in security
✓ Email verification available
✓ Password reset flow
✓ Session management
✗ No 2FA (room for improvement)

Layer 3: API Security
─────────────────────
- Server Actions (server-side only)
- No client-side API keys exposure
- AI API key in environment variable
- HTTPS only in production

Security Controls:
✓ Server-side execution
✓ Environment variable protection
✓ Type-safe inputs/outputs
✗ No API rate limiting (room for improvement)

Layer 4: Data Security
──────────────────────
- Firestore security rules
- Role-based access control
- User-scoped data isolation

Security Rules Example:
```
match /students/{studentId} {
  allow read: if request.auth != null;
  allow write: if request.auth != null && 
                  request.auth.token.admin == true;
}
```

Layer 5: Client Security
────────────────────────
- HTTPS enforced
- Content Security Policy
- XSS prevention via React
- CSRF protection via Next.js

Security Controls:
✓ React auto-escaping
✓ Sanitized user inputs
✓ No eval() usage
✓ Secure headers
```

### Data Privacy

```
Student Data Handling:
- Personal info: name, roll, email, phone
- Academic data: chat history, quiz results
- AI interactions: saved with consent implied
- No sharing with third parties
- GDPR considerations needed for EU students

Admin Data Handling:
- Email stored in Firebase Auth
- Password hashed by Firebase
- Admin actions logged (can be improved)

AI Data Processing:
- Prompts sent to Google Gemini API
- Subject to Google AI's privacy policy
- No training on user data (per Gemini ToS)
- Temporary processing only
```

---

## 6. Performance Considerations

### Frontend Performance

```
Optimization Strategy:
┌─────────────────────────────────────┐
│  Code Splitting                     │
│  - Dynamic imports for views        │
│  - Lazy loading components          │
│  - Route-based splitting            │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Asset Optimization                 │
│  - Tailwind CSS purging             │
│  - Image optimization (Next/Image)  │
│  - Font subsetting (Google Fonts)   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Rendering Optimization             │
│  - SSR for landing page (SEO)       │
│  - CSR for dashboard (interactivity)│
│  - React memoization where needed   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  State Management                   │
│  - Local state for UI               │
│  - sessionStorage for auth          │
│  - Firestore for persistence        │
└─────────────────────────────────────┘
```

### Backend Performance

```
Server Action Optimization:
- Parallel operations where possible
- Early returns on validation failures
- Efficient Firestore queries
- Batch writes for bulk operations

AI Performance:
- Model: Gemini 2.0 Flash (optimized for speed)
- Streaming not yet implemented (room for improvement)
- Response caching not implemented (room for improvement)
- Concurrent flow executions supported
```

### Database Performance

```
Firestore Optimization:
┌─────────────────────────────────────┐
│  Indexing Strategy                  │
│  - Composite indexes for queries    │
│  - Single-field indexes auto-created│
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Query Optimization                 │
│  - Limit results (pagination)       │
│  - Order by timestamp (indexed)     │
│  - Where clauses on indexed fields  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Data Structure                     │
│  - Denormalization for read speed   │
│  - Subcollections for scalability   │
│  - Document size < 1MB              │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Real-time Listeners                │
│  - Scoped to user data only         │
│  - Unsubscribe on component unmount │
│  - Debounce UI updates if needed    │
└─────────────────────────────────────┘
```

### Scalability Considerations

```
Current State:
- Students: 30 (pilot)
- Admins: 1-5
- Concurrent users: <10
- AI requests: ~100/day

Scaling Readiness:
✓ Firebase auto-scales
✓ Stateless server actions
✓ CDN-ready static assets
✓ Serverless deployment

Bottlenecks to Watch:
⚠ Gemini API rate limits
⚠ Firestore read/write quotas
⚠ Firebase Auth quota
⚠ Bandwidth costs

Scaling to 1000+ Students:
- Implement caching layer
- Add rate limiting
- Optimize AI prompt length
- Consider Firebase Blaze plan
- Add monitoring & alerting
```

---

## 🔧 Performance Metrics (Target)

### Frontend
- **FCP (First Contentful Paint)**: < 1.5s
- **LCP (Largest Contentful Paint)**: < 2.5s
- **TTI (Time to Interactive)**: < 3.5s
- **CLS (Cumulative Layout Shift)**: < 0.1

### Backend
- **Server Action Response**: < 500ms (excluding AI)
- **AI Response Time**: 2-5s (Gemini Flash)
- **Firestore Query**: < 100ms
- **Authentication**: < 1s

---

## 📈 Monitoring & Observability (Future)

```
Recommended Monitoring Stack:
┌─────────────────────────────────────┐
│  Application Monitoring             │
│  - Vercel Analytics (built-in)      │
│  - Firebase Performance Monitoring  │
│  - Sentry for error tracking        │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  User Analytics                     │
│  - Google Analytics 4               │
│  - Mixpanel for product analytics   │
│  - Hotjar for user behavior         │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  AI Monitoring                      │
│  - Genkit tracing (dev mode)        │
│  - Custom logging for prod          │
│  - Token usage tracking             │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Infrastructure                     │
│  - Firebase console dashboards      │
│  - Cloud logging                    │
│  - Alert notifications              │
└─────────────────────────────────────┘
```

---

## 🎯 Architectural Decisions

### Why This Architecture?

1. **Next.js App Router**: Modern, performant, great DX
2. **Server Actions**: Simplified backend, no API routes needed
3. **Genkit**: Type-safe AI, structured flows, debugging tools
4. **Firebase**: Quick setup, real-time, managed infrastructure
5. **TypeScript**: Type safety, better tooling, fewer bugs
6. **Tailwind + shadcn/ui**: Rapid UI development, consistency

### Trade-offs Made

| Decision | Pro | Con |
|----------|-----|-----|
| sessionStorage auth | Simple, secure | No persistent login |
| No REST API | Less code, simpler | Less flexibility |
| Client-side Firebase | Real-time updates | Security rule complexity |
| Gemini Flash model | Fast, cheap | Less capable than Pro |
| No caching | Simpler code | Higher AI costs |

---

**Last Updated**: December 2025  
**Document Version**: 1.0
