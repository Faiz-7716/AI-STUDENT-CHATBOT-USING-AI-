# FAIZAI - Developer Quick Start Guide

## 🚀 Getting Started in 10 Minutes

This guide will help you set up and run the FAIZAI AI Student Chatbot locally.

---

## Prerequisites

Before you begin, ensure you have:

- **Node.js** 20+ installed ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Git** for version control
- **Firebase account** ([Sign up free](https://firebase.google.com/))
- **Google AI Studio API key** ([Get key](https://makersuite.google.com/app/apikey))
- **Code editor** (VSCode recommended)

---

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Faiz-7716/AI-STUDENT-CHATBOT-USING-AI-.git
cd AI-STUDENT-CHATBOT-USING-AI-
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js, React, TypeScript
- Firebase SDK
- Genkit AI framework
- Tailwind CSS
- UI components (shadcn/ui)

### 3. Set Up Firebase

#### 3.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name it (e.g., "faizai-dev")
4. Enable Google Analytics (optional)
5. Create project

#### 3.2 Enable Firestore Database

1. In Firebase Console, go to **Build** > **Firestore Database**
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location (e.g., us-central)
5. Click "Enable"

#### 3.3 Enable Authentication

1. Go to **Build** > **Authentication**
2. Click "Get started"
3. Enable **Email/Password** provider
4. Click "Save"
5. Go to **Users** tab
6. Click "Add user"
7. Create an admin account:
   - Email: `admin@example.com`
   - Password: `Admin123!` (choose strong password)

#### 3.4 Get Firebase Config

1. Click the gear icon ⚙️ next to "Project Overview"
2. Select "Project settings"
3. Scroll to "Your apps"
4. Click the web icon `</>`
5. Register app (nickname: "faizai-web")
6. Copy the `firebaseConfig` object

### 4. Get Google AI (Gemini) API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Select your Google Cloud project (or create new)
4. Copy the API key

### 5. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
# .env.local

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key-here

# Google Gemini AI
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key-here
```

**Important**: 
- Replace `your-firebase-api-key-here` with your Firebase API key
- Replace `your-gemini-api-key-here` with your Gemini API key
- Never commit this file to Git (it's in `.gitignore`)

### 6. Update Firebase Config in Code

Open `src/lib/firebase.ts` and update the `firebaseConfig` object:

```typescript
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id" // optional
};
```

### 7. Set Up Initial Data

Start the development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser.

#### 7.1 Login as Admin

1. Click **Login**
2. Switch to **Admin Login**
3. Enter the admin credentials you created earlier
4. Click **Login**

#### 7.2 Initialize Database

1. In the admin dashboard, go to **Setup & Data**
2. Click **Bulk Upload Students** to add 30 sample students
3. Click **Bulk Upload Syllabus** to add curriculum data
4. Wait for success messages

Your database is now ready!

### 8. Test Student Login

1. Click **Logout**
2. Click **Login**
3. Use **Student Login** with:
   - Roll Number: `31924U18011`
   - Access Code: `CS25-711-FP`
4. Explore the student dashboard features

---

## 🎮 Trying Out Features

### AI Chat (Ask AI)

1. Login as a student
2. Click **Ask AI** in sidebar
3. Type a question like "What is inheritance in C++?"
4. Wait for AI response
5. Continue the conversation

### Quiz Generator

1. Go to **Quiz Generator**
2. Enter a subject (e.g., "Python Programming")
3. Choose number of questions (e.g., 5)
4. Click **Generate Quiz**
5. Take the quiz and see your score

### Lab Assistant

1. Go to **Lab Assistant**
2. Enter exercise description: "Write a Python program to find factorial using recursion"
3. Select language: Python
4. Click **Generate Solution**
5. Review the code and explanation

### Exam Strategy

1. Go to **Exam Strategy**
2. Enter a subject (e.g., "Data Structures")
3. Click **Generate Strategy**
4. Review likely questions, revision notes, and model answer

### Study Planner

1. Go to **Study Planner**
2. Enter subjects (e.g., "C++, Java, Python")
3. Click **Generate Plan**
4. View 7-day study schedule

---

## 🛠️ Development Tools

### Running Different Modes

```bash
# Development server with hot reload
npm run dev

# Genkit AI development UI (test AI flows)
npm run genkit:dev

# Type checking
npm run typecheck

# Linting
npm run lint

# Production build
npm run build

# Start production server
npm start
```

### Genkit Dev UI (AI Testing)

The Genkit Dev UI is a powerful tool for testing AI flows:

```bash
npm run genkit:dev
```

This opens a UI where you can:
- Test each AI flow independently
- See input/output schemas
- View execution traces
- Debug prompts
- Monitor token usage

Access it at the URL shown in terminal (usually http://localhost:4000).

### Testing AI Flows

In Genkit UI, you can test flows like:

**AI Tutor Flow**:
```json
{
  "question": "What is polymorphism?",
  "syllabus": "OOP concepts...",
  "studentName": "Test Student",
  "history": []
}
```

**Quiz Generator Flow**:
```json
{
  "subject": "Python",
  "numQuestions": 3
}
```

---

## 📂 Project Structure Overview

```
src/
├── ai/              # AI flows and Genkit config
├── app/             # Next.js pages and routing
├── components/      # React components
│   ├── ui/         # Reusable UI components
│   └── views/      # Feature views
├── hooks/           # Custom React hooks
├── lib/             # Utilities and Firebase
└── types/           # TypeScript definitions
```

---

## 🐛 Common Issues & Solutions

### Issue: "Firebase API key is invalid"

**Solution**: Check that `NEXT_PUBLIC_FIREBASE_API_KEY` is set correctly in `.env.local`

### Issue: "AI responses not working"

**Solution**: 
1. Verify `NEXT_PUBLIC_GEMINI_API_KEY` is set
2. Check API key has quota
3. Try in Genkit UI first to isolate issue

### Issue: "Student login fails"

**Solution**:
1. Ensure you ran the bulk upload
2. Check Firestore has `students` collection
3. Verify roll number and code are correct (case-sensitive)

### Issue: "Port 9002 already in use"

**Solution**: 
```bash
# Kill process on port 9002
kill -9 $(lsof -ti:9002)

# Or use different port
npm run dev -- -p 3000
```

### Issue: "Module not found"

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Firestore permission denied"

**Solution**: 
1. Check Firestore security rules in Firebase Console
2. For development, use test mode rules
3. Ensure you're logged in as admin

---

## 🎨 Customization Guide

### Changing Colors

Edit `src/app/globals.css`:

```css
:root {
  --primary: 283 48% 54%;        /* Violet */
  --background: 270 9% 95%;      /* Light gray */
  --accent: 201 37% 45%;         /* Blue */
}
```

### Adding a New Student Feature

1. Create view component: `src/components/views/my-feature-view.tsx`
2. Add to `studentViews` object in `src/components/dashboard.tsx`
3. Add menu item to `studentMenuItems` array
4. Add route handling

### Adding an AI Flow

1. Create flow file: `src/ai/flows/my-flow.ts`
2. Define input/output schemas with Zod
3. Create prompt template
4. Define flow with `ai.defineFlow()`
5. Export async function
6. Add server action in `src/app/actions.ts`

---

## 📚 Learning Resources

### Essential Docs

- **Next.js**: https://nextjs.org/docs
- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org/docs
- **Genkit**: https://firebase.google.com/docs/genkit
- **Firebase**: https://firebase.google.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

### Video Tutorials

- Next.js App Router: [YouTube](https://www.youtube.com/results?search_query=nextjs+app+router)
- Firebase Firestore: [YouTube](https://www.youtube.com/results?search_query=firebase+firestore)
- Genkit AI: [YouTube](https://www.youtube.com/results?search_query=firebase+genkit)

---

## 🧪 Testing Checklist

Before committing code, test:

- [ ] Development server starts without errors
- [ ] Type checking passes: `npm run typecheck`
- [ ] Linting passes: `npm run lint`
- [ ] Admin login works
- [ ] Student login works
- [ ] At least one AI feature works
- [ ] Firestore reads/writes work
- [ ] No console errors in browser
- [ ] Mobile responsive layout looks good
- [ ] Dark mode toggle works

---

## 🚢 Deployment Guide (Quick)

### Firebase App Hosting

```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login to Firebase
firebase login

# 3. Initialize Firebase in project
firebase init hosting

# 4. Build production version
npm run build

# 5. Deploy
firebase deploy --only hosting
```

Your app will be live at `https://your-project-id.web.app`

For detailed deployment instructions, see the main documentation.

---

## 💡 Pro Tips

1. **Use Genkit UI**: Always test AI flows in Genkit UI first before integrating
2. **Check Browser Console**: Keep DevTools open to catch errors early
3. **Use TypeScript**: Let the compiler catch bugs for you
4. **Git Branches**: Create feature branches for new work
5. **Firestore Console**: Monitor database in real-time while developing
6. **Environment Variables**: Never commit API keys to Git
7. **Hot Reload**: Save files to see changes instantly
8. **Mobile Testing**: Use browser DevTools responsive mode
9. **Error Boundaries**: Add try-catch for production-ready code
10. **Documentation**: Update docs when adding features

---

## 🤝 Getting Help

### If You're Stuck

1. **Check Console**: Look for error messages in browser/terminal
2. **Read Error Messages**: They usually point to the issue
3. **Check Documentation**: Refer to official docs
4. **Google the Error**: Someone likely had the same issue
5. **Check GitHub Issues**: Search the repo's issue tracker
6. **Ask ChatGPT**: Explain your problem and error message
7. **Contact Support**: Email support@faizai.com

### Debugging Tips

```bash
# Check environment variables are loaded
console.log(process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "✓" : "✗");

# Check Firestore connection
import { db } from '@/lib/firebase';
console.log('Firebase initialized:', !!db);

# Check AI configuration
import { ai } from '@/ai/genkit';
console.log('Genkit initialized:', !!ai);

# Log Server Action calls
console.log('Calling runAiTutor with:', input);
const result = await runAiTutor(input);
console.log('Received:', result);
```

---

## 🎯 Next Steps

Once you have the basics working:

1. **Explore the Codebase**: Read through component files
2. **Modify UI**: Change colors, layouts, text
3. **Add Features**: Create your own student view
4. **Experiment with AI**: Try different prompts and models
5. **Study Architecture**: Review `ARCHITECTURE.md`
6. **Read Full Docs**: Check `PROJECT_OVERVIEW.md`
7. **Contribute**: Fix bugs, add features, improve docs

---

## 📝 Cheat Sheet

### Quick Commands

```bash
# Start everything
npm run dev              # App at localhost:9002
npm run genkit:dev       # AI UI at localhost:4000

# Testing
npm run typecheck        # Check types
npm run lint            # Check code style

# Building
npm run build           # Create production build
npm start               # Run production build

# Debugging
npm run dev -- --turbo  # Faster dev mode (default)
```

### Default Credentials

```
Admin:
Email: admin@example.com
Password: (what you set)

Student:
Roll: 31924U18011
Code: CS25-711-FP
```

### Important Files

```
.env.local              # Environment variables
src/lib/firebase.ts     # Firebase config
src/ai/genkit.ts        # AI config
src/app/actions.ts      # Server actions
src/components/dashboard.tsx  # Main layout
```

### Useful Commands

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version

# Check npm version
npm --version
```

---

## 🎉 You're Ready!

You should now have a working local development environment. Start exploring and building!

**Remember**: 
- Make small changes and test often
- Use version control (Git)
- Have fun learning and building! 🚀

---

**Last Updated**: December 2025  
**Guide Version**: 1.0  
**Difficulty**: Beginner-Friendly
