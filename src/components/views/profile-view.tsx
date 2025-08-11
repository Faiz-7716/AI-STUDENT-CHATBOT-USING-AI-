
"use client";

import { useState, useEffect } from "react";
import { type User } from "@/types";
import { updateStudentProfile } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserIcon, Save } from "lucide-react";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ProfileViewProps {
  user: User & { id: string };
}

export default function ProfileView({ user }: ProfileViewProps) {
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!user.id) return;

    const unsub = onSnapshot(doc(db, "students", user.id), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setName(data.name || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
      }
    });

    return () => unsub();
  }, [user.id]);


  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateStudentProfile(user.id, { name, email, phone });
      
      // Update sessionStorage
      const storedUser = sessionStorage.getItem("user");
      if(storedUser) {
        const updatedUser = { ...JSON.parse(storedUser), name, email, phone };
        sessionStorage.setItem("user", JSON.stringify(updatedUser));
      }

      toast({
        title: "Profile Updated",
        description: "Your information has been saved successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not save your profile.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={`https://placehold.co/128x128.png?text=${name.charAt(0)}`} />
              <AvatarFallback><UserIcon className="h-8 w-8"/></AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{name}</CardTitle>
              <CardDescription>Update your personal information below.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={isSaving}/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="roll">Roll Number</Label>
                    <Input id="roll" value={user.roll || ""} disabled />
                </div>
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isSaving} placeholder="your.email@example.com"/>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={isSaving} placeholder="+91 12345 67890"/>
                </div>
            </div>
            
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Save className="mr-2 h-4 w-4 animate-pulse" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
