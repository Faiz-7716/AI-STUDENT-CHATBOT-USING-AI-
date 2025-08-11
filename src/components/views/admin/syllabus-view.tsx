
"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, doc, setDoc, updateDoc, deleteField, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { type Syllabus, type SyllabusCourse } from "@/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Trash2, PlusCircle, BookCopy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function AdminSyllabusView() {
  const [syllabus, setSyllabus] = useState<Syllabus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchSyllabus = async () => {
    setIsLoading(true);
    try {
      const syllabusSnapshot = await getDocs(collection(db, "syllabus"));
      const syllabusData: Syllabus = {};
      syllabusSnapshot.forEach(doc => {
        syllabusData[doc.id] = doc.data();
      });
      setSyllabus(syllabusData);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not fetch syllabus." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSyllabus();
  }, []);
  
  const handleAddSemester = async (semesterName: string) => {
    if (!semesterName.trim() || syllabus?.[semesterName]) {
        toast({ variant: "destructive", title: "Invalid Name", description: "Semester name cannot be empty or already exist." });
        return;
    }
    try {
        await setDoc(doc(db, "syllabus", semesterName), {});
        toast({ title: "Success", description: `Semester '${semesterName}' added.` });
        fetchSyllabus();
    } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Could not add semester." });
    }
  };
  
  const handleDeleteSemester = async (semesterName: string) => {
     try {
        await deleteDoc(doc(db, "syllabus", semesterName));
        toast({ title: "Success", description: `Semester '${semesterName}' deleted.` });
        fetchSyllabus();
    } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Could not delete semester." });
    }
  }

  const handleAddCourse = async (semesterName: string, courseData: { code: string, title: string, category: string, content: string, type: 'units' | 'exercises' | 'options' }) => {
    const { code, title, category, content, type } = courseData;
    if (!code.trim() || !title.trim() || !category.trim()) {
        toast({ variant: "destructive", title: "Missing Fields", description: "Please fill all course fields." });
        return;
    }

    const courseContent = content.split('\n').map(item => item.trim()).filter(Boolean);
    if(courseContent.length === 0) {
        toast({ variant: "destructive", title: "Missing Content", description: "Please add at least one unit/exercise/option." });
        return;
    }
    
    const newCourse: SyllabusCourse = { title, category, [type]: courseContent };

    try {
      const semesterDocRef = doc(db, "syllabus", semesterName);
      await updateDoc(semesterDocRef, { [code]: newCourse });
      toast({ title: "Success", description: `Course '${code}' added to ${semesterName}.` });
      fetchSyllabus();
    } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Could not add course." });
    }
  };
  
  const handleDeleteCourse = async (semesterName: string, courseCode: string) => {
    try {
        const semesterDocRef = doc(db, "syllabus", semesterName);
        await updateDoc(semesterDocRef, { [courseCode]: deleteField() });
        toast({ title: "Success", description: `Course '${courseCode}' deleted.` });
        fetchSyllabus();
    } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Could not delete course." });
    }
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center justify-between">
                Syllabus Management
                <AddSemesterForm onAddSemester={handleAddSemester} />
            </CardTitle>
            <CardDescription>Directly manage the syllabus content in the database.</CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading ? <Skeleton className="h-40 w-full" /> : 
             syllabus && Object.keys(syllabus).length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                    {Object.entries(syllabus).sort((a, b) => a[0].localeCompare(b[0])).map(([semesterName, courses]) => (
                        <AccordionItem key={semesterName} value={semesterName}>
                            <div className="flex items-center w-full">
                                <AccordionTrigger className="text-lg font-semibold flex-1">
                                    {semesterName}
                                </AccordionTrigger>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-destructive mr-4"><Trash2 className="h-4 w-4"/></Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader><AlertDialogTitle>Delete {semesterName}?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the semester and all its courses. This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                                        <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteSemester(semesterName)}>Delete</AlertDialogAction></AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                            <AccordionContent className="p-2 space-y-4">
                                {Object.keys(courses).length > 0 ? (
                                    Object.entries(courses).map(([courseCode, course]) => (
                                        <Card key={courseCode} className="bg-muted/40">
                                            <CardHeader className="flex flex-row items-center justify-between">
                                                <div className="space-y-1">
                                                    <CardTitle className="text-base">{courseCode}: {course.title}</CardTitle>
                                                    <CardDescription>{course.category}</CardDescription>
                                                </div>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4"/></Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader><AlertDialogTitle>Delete {courseCode}?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the course '{course.title}'. This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                                                        <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteCourse(semesterName, courseCode)}>Delete</AlertDialogAction></AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </CardHeader>
                                            <CardContent>
                                                {course.units && <ul className="list-disc pl-5 text-sm">{(course.units).map((item, i) => <li key={i}>{item}</li>)}</ul>}
                                                {course.exercises && <ul className="list-disc pl-5 text-sm">{(course.exercises).map((item, i) => <li key={i}>{item}</li>)}</ul>}
                                                {course.options && <ul className="list-disc pl-5 text-sm">{(course.options).map((item, i) => <li key={i}>{item}</li>)}</ul>}
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground p-4 text-center">No courses added for this semester yet.</p>
                                )}
                                <AddCourseForm semesterName={semesterName} onAddCourse={handleAddCourse} />
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
             ) : (
                <div className="text-center py-10">
                    <BookCopy className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-medium">No Syllabus Data</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Get started by adding a semester.</p>
                </div>
             )
            }
        </CardContent>
      </Card>
    </div>
  );
}

function AddSemesterForm({ onAddSemester }: { onAddSemester: (name: string) => void }) {
    const [name, setName] = useState("");
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddSemester(name);
        setName("");
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4"/> Add Semester</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <form onSubmit={handleSubmit}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Add New Semester</AlertDialogTitle>
                        <AlertDialogDescription>Enter the name for the new semester (e.g., "Semester 7").</AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4">
                        <Label htmlFor="semester-name">Semester Name</Label>
                        <Input id="semester-name" value={name} onChange={e => setName(e.target.value)} required />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction type="submit">Add</AlertDialogAction>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}

function AddCourseForm({ semesterName, onAddCourse }: { semesterName: string, onAddCourse: (semester: string, data: any) => void }) {
    const [code, setCode] = useState("");
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState<'units' | 'exercises' | 'options'>('units');
    const [content, setContent] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddCourse(semesterName, { code, title, category, type, content });
        setCode("");
        setTitle("");
        setCategory("");
        setContent("");
    }
    
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                 <Button variant="secondary" className="w-full mt-4"><PlusCircle className="mr-2 h-4 w-4"/> Add Course to {semesterName}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-md">
                 <form onSubmit={handleSubmit}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Add New Course</AlertDialogTitle>
                        <AlertDialogDescription>Fill in the details for the new course.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1"><Label htmlFor="course-code">Code</Label><Input id="course-code" placeholder="e.g., CC18" value={code} onChange={e => setCode(e.target.value)} required /></div>
                            <div className="space-y-1"><Label htmlFor="course-category">Category</Label><Input id="course-category" placeholder="e.g., Core" value={category} onChange={e => setCategory(e.target.value)} required /></div>
                        </div>
                        <div className="space-y-1"><Label htmlFor="course-title">Title</Label><Input id="course-title" placeholder="e.g., Advanced Java" value={title} onChange={e => setTitle(e.target.value)} required /></div>
                         <div className="space-y-1"><Label>Content Type</Label>
                            <Select onValueChange={(v: any) => setType(v)} defaultValue={type}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="units">Units</SelectItem>
                                    <SelectItem value="exercises">Lab Exercises</SelectItem>
                                    <SelectItem value="options">Elective Options</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1"><Label htmlFor="course-content">Content (one per line)</Label><Textarea id="course-content" placeholder="Unit 1: ...&#10;Unit 2: ..." value={content} onChange={e => setContent(e.target.value)} required /></div>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction type="submit">Add Course</AlertDialogAction>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}

    
