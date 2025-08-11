"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { type User } from "@/types";
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogOut, Settings, Users, Bell, FileText, Award, BookOpen, MessageCircle, Book, Target, Terminal, Calendar, HelpCircle, GraduationCap } from "lucide-react";

import ChatView from "@/components/views/chat-view";
import NotificationsView from "@/components/views/notifications-view";
import NotesView from "@/components/views/notes-view";
import SyllabusBrowserView from "@/components/views/syllabus-browser-view";
import ExamStrategyView from "@/components/views/exam-strategy-view";
import LabAssistantView from "@/components/views/lab-assistant-view";
import NaanView from "@/components/views/naan-view";
import ExtraCoursesView from "@/components/views/extra-courses-view";
import StudyPlannerView from "@/components/views/study-planner-view";
import QuizGeneratorView from "@/components/views/quiz-generator-view";
import AdminSetupView from "@/components/views/admin/setup-view";
import AdminStudentsView from "@/components/views/admin/students-view";
import AdminNotificationsView from "@/components/views/admin/notifications-view";
import AdminNotesView from "@/components/views/admin/notes-view";
import AdminNaanView from "@/components/views/admin/naan-view";
import AdminExtraCoursesView from "@/components/views/admin/extra-courses-view";

const studentViews: { [key: string]: React.ComponentType<any> } = {
  chat: ChatView,
  notifications: NotificationsView,
  notes: NotesView,
  topics: SyllabusBrowserView,
  exam: ExamStrategyView,
  lab: LabAssistantView,
  naan: NaanView,
  extra: ExtraCoursesView,
  planner: StudyPlannerView,
  quiz: QuizGeneratorView,
};

const adminViews: { [key: string]: React.ComponentType<any> } = {
  'admin-setup': AdminSetupView,
  'admin-students': AdminStudentsView,
  'admin-notifications': AdminNotificationsView,
  'admin-notes': AdminNotesView,
  'admin-naan': AdminNaanView,
  'admin-extra': AdminExtraCoursesView,
};

const studentMenuItems = [
  { key: 'chat', label: 'Ask AI', icon: MessageCircle },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'notes', label: 'Notes & Files', icon: FileText },
  { key: 'topics', label: 'Syllabus Browser', icon: Book },
  { key: 'exam', label: 'Exam Strategy', icon: Target },
  { key: 'lab', label: 'Lab Assistant', icon: Terminal },
  { key: 'naan', label: 'Naan Mudhalvan', icon: Award },
  { key: 'extra', label: 'Extra Courses', icon: BookOpen },
  { key: 'planner', label: 'Study Planner', icon: Calendar },
  { key: 'quiz', label: 'Quiz Generator', icon: HelpCircle },
];

const adminMenuItems = [
  { key: 'admin-setup', label: 'Setup & Data', icon: Settings },
  { key: 'admin-students', label: 'Students', icon: Users },
  { key: 'admin-notifications', label: 'Notifications', icon: Bell },
  { key: 'admin-notes', label: 'Notes', icon: FileText },
  { key: 'admin-naan', label: 'Naan Mudhalvan', icon: Award },
  { key: 'admin-extra', label: 'Extra Courses', icon: BookOpen },
];

export function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setView(parsedUser.isAdmin ? 'admin-setup' : 'chat');
    } else {
      router.push("/");
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    router.push("/");
  };

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const CurrentView = user.isAdmin ? adminViews[view] : studentViews[view];
  const menuItems = user.isAdmin ? adminMenuItems : studentMenuItems;

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <Sidebar className="flex flex-col border-r w-72" collapsible="icon">
          <SidebarHeader className="p-4 border-b">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-primary" />
              <div className="group-data-[collapsible=icon]:hidden">
                <h2 className="font-bold text-lg">TutorAI</h2>
                <p className="text-xs text-muted-foreground">B.Sc. CS Assistant</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="flex-1 overflow-y-auto">
            <SidebarMenu className="p-2">
              {menuItems.map(item => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    onClick={() => setView(item.key)}
                    isActive={view === item.key}
                    tooltip={item.label}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t">
             <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={`https://placehold.co/40x40.png?text=${user.name.charAt(0)}`} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="group-data-[collapsible=icon]:hidden">
                  <p className="font-semibold text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.isAdmin ? 'Administrator' : 'Student'}</p>
                </div>
              </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b h-16">
            <h1 className="text-xl font-semibold">
              {menuItems.find(item => item.key === view)?.label}
            </h1>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto bg-muted/20">
            {CurrentView && <CurrentView user={user} />}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
