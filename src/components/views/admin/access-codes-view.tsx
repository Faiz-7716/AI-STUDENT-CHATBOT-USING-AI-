"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { type Student } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

export default function AdminAccessCodesView() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const q = query(collection(db, "students"), orderBy("roll"));
        const querySnapshot = await getDocs(q);
        const fetchedStudents = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Student[];
        setStudents(fetchedStudents);
      } catch (error) {
        console.error("Error fetching students:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not fetch students." });
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, [toast]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedCode(text);
      toast({ title: "Copied!", description: "Access code copied to clipboard." });
      setTimeout(() => setCopiedCode(null), 2000);
    }, (err) => {
      toast({ variant: "destructive", title: "Failed to copy", description: "Could not copy text." });
    });
  };

  return (
    <div className="p-4 sm:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Student Access Codes</CardTitle>
          <CardDescription>A complete list of all student names, roll numbers, and their unique access codes.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Roll Number</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Access Code</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={3} className="text-center">Loading...</TableCell></TableRow>
              ) : students.length > 0 ? (
                students.map(student => (
                  <TableRow key={student.id}>
                    <TableCell>{student.roll}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code>{student.code}</code>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyToClipboard(student.code)}>
                          {copiedCode === student.code ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={3} className="text-center">No students found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
