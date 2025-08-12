
"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db, addDoc, deleteDoc, doc } from "@/lib/firebase";
import { type NaanCourse } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminNaanView() {
  const [courses, setCourses] = useState<NaanCourse[]>([]);
  const [newCourse, setNewCourse] = useState({ title: "", provider: "", semester: "1", link: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, "naanMudhalvanCourses"), orderBy("semester"));
      const querySnapshot = await getDocs(q);
      const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as NaanCourse[];
      setCourses(fetched);
    } catch (error) { toast({ variant: "destructive", title: "Error", description: "Could not fetch courses." }); } 
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCourse({ ...newCourse, [e.target.id]: e.target.value });
  };
  
  const handleSelectChange = (value: string) => {
    setNewCourse({ ...newCourse, semester: value });
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "naanMudhalvanCourses"), { ...newCourse, semester: Number(newCourse.semester) });
      setNewCourse({ title: "", provider: "", semester: "1", link: "" });
      toast({ title: "Success", description: "Course added." });
      fetchCourses();
    } catch (error) { toast({ variant: "destructive", title: "Error", description: "Failed to add course." }); } 
    finally { setIsSubmitting(false); }
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await deleteDoc(doc(db, "naanMudhalvanCourses", courseId));
      toast({ title: "Success", description: "Course deleted." });
      setCourses(courses.filter(c => c.id !== courseId));
    } catch (error) { toast({ variant: "destructive", title: "Error", description: "Failed to delete course." }); }
  };
  
  return (
    <div className="p-4 sm:p-6 space-y-6">
      <Card>
        <CardHeader><CardTitle>Add New Naan Mudhalvan Course</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleAddCourse} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2 lg:col-span-2"><Label htmlFor="title">Course Title</Label><Input id="title" value={newCourse.title} onChange={handleInputChange} required disabled={isSubmitting}/></div>
              <div className="space-y-2"><Label htmlFor="provider">Provider</Label><Input id="provider" value={newCourse.provider} onChange={handleInputChange} required disabled={isSubmitting}/></div>
              <div className="space-y-2"><Label>Semester</Label>
                <Select value={newCourse.semester} onValueChange={handleSelectChange} required disabled={isSubmitting}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>{Array.from({length: 6}, (_, i) => <SelectItem key={i+1} value={(i+1).toString()}>{i+1}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2 lg:col-span-4"><Label htmlFor="link">Course Link</Label><Input id="link" type="url" value={newCourse.link} onChange={handleInputChange} required disabled={isSubmitting}/></div>
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">{isSubmitting ? "Adding..." : "Add Course"}</Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle>Existing Courses</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Sem</TableHead><TableHead>Title</TableHead><TableHead className="hidden sm:table-cell">Provider</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {isLoading ? (<TableRow><TableCell colSpan={4} className="text-center">Loading...</TableCell></TableRow>) 
              : courses.length > 0 ? (courses.map(course => (
                  <TableRow key={course.id}>
                    <TableCell>{course.semester}</TableCell>
                    <TableCell className="font-medium">{course.title}</TableCell>
                    <TableCell className="hidden sm:table-cell">{course.provider}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteCourse(course.id)}><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))) 
              : (<TableRow><TableCell colSpan={4} className="text-center">No courses found.</TableCell></TableRow>)}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
