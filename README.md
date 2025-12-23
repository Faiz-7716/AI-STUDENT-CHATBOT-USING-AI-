# FAIZAI - AI Student Chatbot

<div align="center">

![FAIZAI Logo](https://img.shields.io/badge/FAIZAI-AI%20Classroom%20Assistant-9466A7?style=for-the-badge)

**An AI-powered classroom assistant for B.Sc. Computer Science students**

[![Next.js](https://img.shields.io/badge/Next.js-15.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-11.9-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Genkit](https://img.shields.io/badge/Genkit-1.14-FF6F00?style=flat-square)](https://firebase.google.com/docs/genkit)

[Features](#-features) • [Quick Start](QUICK_START.md) • [Documentation](PROJECT_OVERVIEW.md) • [Architecture](ARCHITECTURE.md)

</div>

---

## 📖 About

**FAIZAI** is a comprehensive AI-powered educational platform designed specifically for B.Sc. Computer Science students at Mazharul Uloom College. It combines the power of Google's Gemini AI with an intuitive interface to provide:

- 🤖 **24/7 AI Tutoring** - Get instant help with syllabus topics
- 📝 **Smart Quiz Generation** - Test your knowledge with AI-generated quizzes
- 💻 **Lab Code Assistant** - Get help with programming assignments
- 📚 **Exam Strategy Tools** - Prepare effectively with AI-generated study materials
- 📅 **Study Planner** - Get personalized 7-day study schedules
- 👨‍💼 **Admin Portal** - Manage students, content, and notifications

**Developed by:** Mohammed Faiz & AI

---

## ✨ Features

### For Students (11 Features)

| Feature | Description |
|---------|-------------|
| 🗨️ **Ask AI** | Conversational AI tutor with chat history |
| 🧠 **Quiz Generator** | Create and take AI-powered quizzes |
| 🎯 **Exam Strategy** | Get likely questions and revision notes |
| 💻 **Lab Assistant** | Code solutions with explanations (Python, C++, Java, SQL) |
| 📅 **Study Planner** | Personalized 7-day study schedules |
| 📚 **Syllabus Browser** | Interactive syllabus exploration |
| 📢 **Notifications** | Real-time updates from admin |
| 📄 **Notes & Files** | Access course materials |
| 🏆 **Naan Mudhalvan** | Government course integration |
| 📖 **Extra Courses** | Supplementary learning resources |
| 👤 **My Profile** | Manage your information |

### For Admins (8 Features)

| Feature | Description |
|---------|-------------|
| ⚙️ **Setup & Data** | Bulk upload students and syllabus |
| 👥 **Students Management** | Add, edit, delete students |
| 📢 **Notifications** | Push announcements to students |
| 📄 **Notes Management** | Upload course materials |
| 📚 **Syllabus Management** | Maintain curriculum data |
| 🏆 **Naan Mudhalvan** | Manage government courses |
| 📖 **Extra Courses** | Manage supplementary resources |
| 🔑 **Access Codes** | View and manage student codes |

---

## 🚀 Quick Start

Get up and running in 10 minutes! See [QUICK_START.md](QUICK_START.md) for detailed setup instructions.

### Prerequisites

- Node.js 20+
- Firebase account
- Google AI (Gemini) API key

### Installation

```bash
# Clone the repository
git clone https://github.com/Faiz-7716/AI-STUDENT-CHATBOT-USING-AI-.git
cd AI-STUDENT-CHATBOT-USING-AI-

# Install dependencies
npm install

# Set up environment variables (see QUICK_START.md)
# Create .env.local with your API keys

# Run development server
npm run dev
```

Visit [http://localhost:9002](http://localhost:9002) to see the app.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Next.js Server Actions
- **AI**: Google Genkit, Gemini 2.0 Flash
- **Database**: Firebase Firestore
- **Auth**: Firebase Authentication (admin), Custom (students)
- **Deployment**: Firebase App Hosting

---

## 📚 Documentation

Comprehensive documentation is available:

- **[QUICK_START.md](QUICK_START.md)** - Get started in 10 minutes
- **[PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)** - Complete project documentation
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Technical architecture deep dive
- **[docs/blueprint.md](docs/blueprint.md)** - Original design blueprint

---

## 🏗️ Project Structure

```
src/
├── ai/              # AI flows (5 Genkit modules)
├── app/             # Next.js pages & routing
├── components/      # React components
│   ├── ui/         # shadcn/ui components (30+)
│   └── views/      # Feature views (19 total)
├── hooks/           # Custom React hooks
├── lib/             # Firebase & utilities
└── types/           # TypeScript definitions
```

---

## 💻 Development

### Available Scripts

```bash
npm run dev          # Start development server (port 9002)
npm run genkit:dev   # Start Genkit AI dev UI
npm run build        # Build for production
npm run typecheck    # Run TypeScript type checking
npm run lint         # Run ESLint
```

### Testing AI Flows

Use Genkit Dev UI to test AI flows independently:

```bash
npm run genkit:dev
```

---

## 🎨 Design

- **Primary Color**: Muted Violet (#9466A7)
- **Background**: Light Gray (#F0EFF2)
- **Accent**: Deep Blue (#4A7E9F)
- **Font**: Poppins (Google Fonts)
- **Theme**: Light/Dark mode support

---

## 🔐 Authentication

### Student Login
- Roll Number + Access Code
- No password required
- Session-based authentication

### Admin Login
- Email + Password (Firebase Auth)
- Full management capabilities

**Default Test Student:**
- Roll: `31924U18011`
- Code: `CS25-711-FP`

---

## 🌟 Key Features Showcase

### AI Chat with Conversation History
Students can have ongoing conversations with the AI tutor, with all history saved for future reference.

### Smart Quiz System
AI generates quizzes on any subject with instant grading and performance tracking.

### Lab Code Generation
Get working code solutions with detailed explanations for programming exercises.

### Real-time Notifications
Admins can push notifications that appear instantly for all students.

---

## 📊 Statistics

- **Students**: 30 (pilot program)
- **Semesters Covered**: 6 (full B.Sc. CS curriculum)
- **AI Flows**: 5 specialized modules
- **UI Components**: 30+ reusable components
- **View Components**: 19 (11 student + 8 admin)
- **Total Lines of Code**: ~10,000+

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is developed for educational purposes at Mazharul Uloom College.

---

## 👨‍💻 Developer

**Mohammed Faiz**
- Email: support@faizai.com
- Institution: Mazharul Uloom College

---

## 🙏 Acknowledgments

- B.Sc. Computer Science Department, Mazharul Uloom College
- Google for Gemini AI and Firebase services
- Next.js and React communities
- shadcn for the amazing UI component library

---

## 📞 Support

For technical support or questions:
- Email: support@faizai.com
- Phone: +91 12345 67890

---

<div align="center">

**Built with ❤️ for education**

[⬆ Back to Top](#faizai---ai-student-chatbot)

</div>
