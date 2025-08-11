"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, GraduationCap } from "lucide-react";

export default function LoginPage() {
  const [isStudentLogin, setIsStudentLogin] = useState(false);
  const [roll, setRoll] = useState("");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("pmdfaiz08@gmail.com");
  const [password, setPassword] = useState("Faiz@2005");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!roll || !code) {
      toast({ variant: "destructive", title: "Error", description: "Please fill in all fields." });
      setIsLoading(false);
      return;
    }
    try {
      const q = query(collection(db, "students"), where("roll", "==", roll.trim()));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        toast({ variant: "destructive", title: "Login Failed", description: "Roll number not found." });
        setIsLoading(false);
        return;
      }
      const studentDoc = querySnapshot.docs[0];
      if (studentDoc.data().code === code.trim()) {
        const student = { id: studentDoc.id, ...studentDoc.data(), isAdmin: false };
        sessionStorage.setItem("user", JSON.stringify(student));
        toast({ title: "Login Successful", description: `Welcome, ${student.name}!` });
        router.push("/dashboard");
      } else {
        toast({ variant: "destructive", title: "Login Failed", description: "Incorrect access code." });
      }
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: "An error occurred during login." });
    }
    setIsLoading(false);
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = { uid: userCredential.user.uid, email: userCredential.user.email, name: "Admin", isAdmin: true };
      sessionStorage.setItem("user", JSON.stringify(user));
      toast({ title: "Admin Login Successful", description: "Welcome, Admin!" });
      router.push("/dashboard");
    } catch (error) {
      toast({ variant: "destructive", title: "Login Failed", description: "Invalid credentials." });
    }
    setIsLoading(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          TutorAI
        </h1>
        <p className="text-muted-foreground mt-2 text-base sm:text-lg">Your Personal AI Classroom Assistant</p>
      </div>

      <Card className="w-full max-w-md shadow-2xl backdrop-blur-sm bg-card/80">
        <CardHeader>
          <CardTitle className="text-2xl">{isStudentLogin ? "Student Login" : "Admin Login"}</CardTitle>
          <CardDescription>
            {isStudentLogin
              ? "Enter your credentials to access your dashboard."
              : "Enter admin credentials to access the portal."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isStudentLogin ? (
            <form onSubmit={handleStudentLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="roll">Roll Number</Label>
                <Input
                  id="roll"
                  type="text"
                  placeholder="e.g., 31924U18001"
                  value={roll}
                  onChange={(e) => setRoll(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Access Code</Label>
                <Input
                  id="code"
                  type="password"
                  placeholder="e.g., CS25-701-AK"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          )}
          <Button variant="link" className="w-full mt-4" onClick={() => setIsStudentLogin(!isStudentLogin)}>
            {isStudentLogin ? "Switch to Admin Login" : "Switch to Student Login"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
