"use client";

import { useState, useEffect, useReducer } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db, addDoc, deleteDoc, doc } from "@/lib/firebase";
import { type Student } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type State = {
  students: Student[];
  isLoading: boolean;
};

type Action =
  | { type: 'FETCH_SUCCESS'; payload: Student[] }
  | { type: 'ADD_STUDENT'; payload: Student }
  | { type: 'REMOVE_STUDENT'; payload: string };

const initialState: State = {
  students: [],
  isLoading: true,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_SUCCESS':
      return { ...state, students: action.payload, isLoading: false };
    case 'ADD_STUDENT':
      return { ...state, students: [...state.students, action.payload].sort((a,b) => a.roll.localeCompare(b.roll)) };
    case 'REMOVE_STUDENT':
      return { ...state, students: state.students.filter(s => s.id !== action.payload) };
    default:
      return state;
  }
}

export default function AdminStudentsView() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [newRoll, setNewRoll] = useState("");
  const [newName, setNewName] = useState("");
  const [newCode, setNewCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const q = query(collection(db, "students"), orderBy("roll"));
        const querySnapshot = await getDocs(q);
        const fetchedStudents = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Student[];
        dispatch({ type: 'FETCH_SUCCESS', payload: fetchedStudents });
      } catch (error) {
        console.error("Error fetching students:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not fetch students." });
      }
    };
    fetchStudents();
  }, [toast]);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const docRef = await addDoc(collection(db, "students"), { roll: newRoll, name: newName, code: newCode });
      dispatch({ type: 'ADD_STUDENT', payload: { id: docRef.id, roll: newRoll, name: newName, code: newCode } });
      setNewRoll("");
      setNewName("");
      setNewCode("");
      toast({ title: "Success", description: "Student added successfully." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to add student." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStudent = async (studentId: string, studentName: string) => {
    try {
      await deleteDoc(doc(db, "students", studentId));
      dispatch({ type: 'REMOVE_STUDENT', payload: studentId });
      toast({ title: "Success", description: `Student ${studentName} deleted.` });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete student." });
    }
  };
  
  return (
    <div className="p-4 sm:p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Student</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddStudent} className="grid sm:grid-cols-3 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2"><Label htmlFor="new-roll">Roll Number</Label><Input id="new-roll" value={newRoll} onChange={e => setNewRoll(e.target.value)} required disabled={isSubmitting}/></div>
            <div className="space-y-2"><Label htmlFor="new-name">Name</Label><Input id="new-name" value={newName} onChange={e => setNewName(e.target.value)} required disabled={isSubmitting}/></div>
            <div className="space-y-2"><Label htmlFor="new-code">Access Code</Label><Input id="new-code" value={newCode} onChange={e => setNewCode(e.target.value)} required disabled={isSubmitting}/></div>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Adding..." : "Add Student"}</Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>A list of all students currently in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Roll Number</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Access Code</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.isLoading ? (
                <TableRow><TableCell colSpan={4} className="text-center">Loading...</TableCell></TableRow>
              ) : state.students.length > 0 ? (
                state.students.map(student => (
                  <TableRow key={student.id}>
                    <TableCell>{student.roll}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell><code>{student.code}</code></TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the student account
                              for <strong>{student.name}</strong>.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteStudent(student.id, student.name)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={4} className="text-center">No students found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
