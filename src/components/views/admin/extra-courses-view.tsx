
"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db, addDoc, deleteDoc, doc } from "@/lib/firebase";
import { type ExtraCourse } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

export default function AdminExtraCoursesView() {
  const [courses, setCourses] = useState<ExtraCourse[]>([]);
  const [newCourse, setNewCourse] = useState({ title: "", description: "", link: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, "extraCourses"), orderBy("title"));
      const querySnapshot = await getDocs(q);
      const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ExtraCourse[];
      setCourses(fetched);
    } catch (error) { toast({ variant: "destructive", title: "Error", description: "Could not fetch courses." }); } 
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewCourse({ ...newCourse, [e.target.id]: e.target.value });
  };
  
  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "extraCourses"), newCourse);
      setNewCourse({ title: "", description: "", link: "" });
      toast({ title: "Success", description: "Course added." });
      fetchCourses();
    } catch (error) { toast({ variant: "destructive", title: "Error", description: "Failed to add course." }); } 
    finally { setIsSubmitting(false); }
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await deleteDoc(doc(db, "extraCourses", courseId));
      toast({ title: "Success", description: "Course deleted." });
      setCourses(courses.filter(c => c.id !== courseId));
    } catch (error) { toast({ variant: "destructive", title: "Error", description: "Failed to delete course." }); }
  };
  
  return (
    <div className="p-4 sm:p-6 space-y-6">
      <Card>
        <CardHeader><CardTitle>Add New Extra Course</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleAddCourse} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="title">Course Title</Label><Input id="title" value={newCourse.title} onChange={handleInputChange} required disabled={isSubmitting}/></div>
              <div className="space-y-2"><Label htmlFor="link">Resource Link</Label><Input id="link" type="url" value={newCourse.link} onChange={handleInputChange} required disabled={isSubmitting}/></div>
            </div>
            <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" value={newCourse.description} onChange={handleInputChange} required disabled={isSubmitting}/></div>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Adding..." : "Add Course"}</Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle>Existing Courses</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Title</TableHead><TableHead className="hidden md:table-cell">Description</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {isLoading ? (<TableRow><TableCell colSpan={3} className="text-center">Loading...</TableCell></TableRow>) 
              : courses.length > 0 ? (courses.map(course => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.title}</TableCell>
                    <TableCell className="hidden md:table-cell">{course.description}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteCourse(course.id)}><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))) 
              : (<TableRow><TableCell colSpan={3} className="text-center">No courses found.</TableCell></TableRow>)}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
