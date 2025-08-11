
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { collection, addDoc, getDocs, limit, query, setDoc, doc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Settings, Users, Book } from "lucide-react";
import { useState } from "react";
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


// This initial data would typically be managed elsewhere, but is included here as per the user's provided script.
const initialStudents = [
    { roll: "31924U18001", name: "Akash", code: "CS25-701-AK" }, { roll: "31924U18002", name: "Devanath S", code: "CS25-702-DS" }, { roll: "31924U18003", name: "Fareed Ahmed V", code: "CS25-703-FA" }, { roll: "31924U18004", name: "Lithishwaran V", code: "CS25-704-LV" }, { roll: "31924U18005", name: "Maaz M G", code: "CS25-705-MG" }, { roll: "31924U18006", name: "Manikandan S", code: "CS25-706-MS" }, { roll: "31924U18007", name: "Mohamad Zabiullah S", code: "CS25-707-MZ" }, { roll: "31924U18008", name: "Mohamed Thaha V I", code: "CS25-708-MT" }, { roll: "31924U18009", name: "Mohammed Arqum V", code: "CS25-709-MA" }, { roll: "31924U18010", name: "Mohammed Azhan T", code: "CS25-710-AZ" }, { roll: "31924U18011", name: "Mohammed Faiz P", code: "CS25-711-FP" }, { roll: "31924U18012", name: "Mohammed Farhan H S", code: "CS25-712-FH" }, { roll: "31924U18013", name: "Mohammed Imran A", code: "CS25-713-IA" }, { roll: "31924U18014", name: "Mohammed Irbaz I", code: "CS25-714-IR" }, { roll: "31924U18015", name: "Mohammed Nahir A", code: "CS25-715-NA" }, { roll: "31924U18016", name: "Mohammed Rashid R", code: "CS25-716-RR" }, { roll: "31924U18017", name: "Mohammed Razi T", code: "CS25-717-RT" }, { roll: "31924U18018", name: "Mohammed Sameer A", code: "CS25-718-SA" }, { roll: "31924U18019", name: "Mohammed Siddique S", code: "CS25-719-SD" }, { roll: "31924U18020", name: "Mohammed Sufiyan A", code: "CS25-720-SY" }, { roll: "31924U18021", name: "Mohammed Yaseer E Y", code: "CS25-721-YE" }, { roll: "31924U18022", name: "Mohammed Yaser C", code: "CS25-722-YC" }, { roll: "31924U18023", name: "Muhammad S", code: "CS25-723-MS" }, { roll: "31924U18024", name: "Saif Ali S", code: "CS25-724-SA" }, { roll: "31924U18025", name: "Sairaj M", code: "CS25-725-SR" }, { roll: "31924U18026", name: "Sanjay S", code: "CS25-726-SJ" }, { roll: "31924U18027", name: "Saranraj S", code: "CS25-727-SR" }, { roll: "31924U18028", name: "Sayed Muhammed Mohathaseem", code: "CS25-728-SM" }, { roll: "31924U18029", name: "Sehal Ahmed T", code: "CS25-729-AT" }, { roll: "31924U18030", name: "Sharif Umer N", code: "CS25-730-SU" }
];
const syllabusData = {
    "Semester 1": {
        "CC1": { "title": "Object Oriented Programming Concepts Using C++", "category": "Core", "units": ["Unit 1: Intro to C++ & OOP", "Unit 2: Classes & Objects", "Unit 3: Operator Overloading & Inheritance", "Unit 4: Pointers & Polymorphism", "Unit 5: Files & Templates"] },
        "CC2": { "title": "C++ LAB", "category": "Core Practical", "exercises": ["Classes", "Constructors", "Function Overloading", "Inheritance", "Virtual Functions", "Files"] },
        "EC1": { "title": "Elective 1", "options": ["Numerical Methods-I", "Discrete Mathematics-I"] },
        "SEC-1": { "title": "Introduction to HTML", "units": ["Unit 1: Web Basics", "Unit 2: Document Structure", "Unit 3: Lists & Links", "Unit 4: Tables", "Unit 5: Frames & Forms"] },
        "FoundationCourse": { "title": "Problem Solving Techniques", "units": ["Unit 1: Computer Basics", "Unit 2: Program Development Cycle", "Unit 3: Control Structures", "Unit 4: Arrays & Strings", "Unit 5: DFDs & Subprograms"] }
    },
    "Semester 2": {
        "CC3": { "title": "Data Structures & Algorithm", "units": ["Unit 1: List ADT", "Unit 2: Stack & Queue ADT", "Unit 3: Tree ADT", "Unit 4: Graphs", "Unit 5: Sorting & Searching"] },
        "CC4": { "title": "Data Structures Lab", "exercises": ["List ADT", "Stack ADT", "Queue ADT", "Infix to Postfix", "Binary Search Tree", "Graph Traversals (BFS, DFS)"] },
        "EC2": { "title": "Elective 2", "options": ["Numerical Methods-II", "Discrete Mathematics–II"] },
        "SEC-2": { "title": "Office Automation", "units": ["Unit 1: Computer Basics", "Unit 2: Word Processing", "Unit 3: Spreadsheets", "Unit 4: Database Concepts", "Unit 5: PowerPoint"] },
        "SEC-3": { "title": "PHP Programming", "units": ["Unit 1: Intro to PHP", "Unit 2: PHP Basics", "Unit 3: Arrays & Loops", "Unit 4: File Handling", "Unit 5: Sessions & Cookies"] }
    },
    "Semester 3": {
        "CC5": { "title": "Python Programming", "units": ["Unit 1: Python Basics & Arrays", "Unit 2: Control Statements", "Unit 3: Functions & Modules", "Unit 4: Lists, Tuples, Dictionaries", "Unit 5: File Handling"] },
        "CC6": { "title": "Python Programming Lab", "exercises": ["Variables & Operators", "Loops", "Functions", "Recursion", "Arrays", "Strings", "Lists, Tuples, Dictionaries", "File Handling"] },
        "EC3": { "title": "Elective 3", "options": ["Statistical Methods and their Applications – I", "Physics-I"] },
        "SEC-4": { "title": "Fundamentals of Information Technology", "units": ["Unit 1: Intro to Computers", "Unit 2: I/O Devices", "Unit 3: Storage", "Unit 4: Software", "Unit 5: Operating Systems"] },
        "SEC-5": { "title": "Understanding Internet", "units": ["Unit 1: Internet Basics", "Unit 2: TCP/IP", "Unit 3: Internet Connectivity", "Unit 4: Networks", "Unit 5: Email Protocols"] },
        "EVS": { "title": "Environmental Studies", "category": "Part-4" }
    },
    "Semester 4": {
        "CC7": { "title": "Java Programming", "units": ["Unit 1: Intro to Java & OOP", "Unit 2: Inheritance & Packages", "Unit 3: Multithreading & I/O", "Unit 4: AWT & Event Handling", "Unit 5: Swing"] },
        "CC8": { "title": "Java Programming Lab", "exercises": ["Prime Numbers", "Matrix Multiplication", "String Manipulation", "Multithreading", "Exception Handling", "File I/O", "AWT Calculator", "Swing Traffic Light"] },
        "EC4": { "title": "Elective 4", "options": ["Statistical Methods and their Applications – II", "Physics-II"] },
        "SEC-6": { "title": "Web Designing", "units": ["Unit 1: HTML Basics", "Unit 2: Forms & Graphics", "Unit 3: CSS & XML", "Unit 4: DHTML", "Unit 5: JavaScript"] },
        "SEC-7": { "title": "Cyber Forensics", "units": ["Unit 1: Intro to Forensics", "Unit 2: Evidence Capture", "Unit 3: Evidence Preservation", "Unit 4: Analysis", "Unit 5: Reconstruction"] }
    },
    "Semester 5": {
        "CC9": { "title": "Operating System", "units": ["Unit 1: Intro & Processes", "Unit 2: Concurrency & Semaphores", "Unit 3: Deadlock", "Unit 4: Scheduling", "Unit 5: Memory Management"] },
        "CC10": { "title": "Operating System Lab", "exercises": ["Shell Programming", "Scheduling Algorithms", "File Allocation", "Semaphores", "Banker's Algorithm", "Page Replacement"] },
        "CC11": { "title": "Data Base Management System", "units": ["Unit 1: Database Concepts", "Unit 2: Relational Model & ER", "Unit 3: Normalization & SQL", "Unit 4: Advanced SQL", "Unit 5: PL/SQL"] },
        "CC12": { "title": "Practical: Data Base Management System Lab", "exercises": ["DDL, DML, TCL", "PL/SQL Basics", "Triggers", "Cursors", "Library Mgmt App"] },
        "CC13": { "title": "Project with Viva voce", "category": "Core" },
        "EC5": { "title": "Elective 5", "options": ["Introduction to Data Science", "Artificial Intelligence", "Computer Networks"] },
        "EC6": { "title": "Elective 6", "options": ["Data Mining and warehousing", "Mobile Computing", "Natural Language Processing"] },
        "VE": { "title": "Value Education", "category": "Part-4" },
        "Internship": { "title": "Internship / Industrial Training", "category": "Part-4" }
    },
    "Semester 6": {
        "CC14": { "title": "Machine Learning", "category": "Core" },
        "CC15": { "title": "Machine Learning Lab", "category": "Core Practical" },
        "CC16": { "title": "Data Analytics using R programming", "category": "Core" },
        "CC17": { "title": "Practical: Data Analytics using R programming Lab", "category": "Core Practical" },
        "EC7": { "title": "Elective 7", "options": ["IOT and its Applications", "Cloud Computing", "Software Project Management"] },
        "EC8": { "title": "Elective 8", "options": ["Software Testing", "Cryptography", "Robotics and its Applications"] },
        "SEC-8": { "title": "Open Source Technology", "category": "Skill Enhancement" },
        "EA": { "title": "Extension Activity", "category": "Part-5" }
    }
};

export default function AdminSetupView() {
  const [isUploadingStudents, setIsUploadingStudents] = useState(false);
  const [isUploadingSyllabus, setIsUploadingSyllabus] = useState(false);
  const { toast } = useToast();

  const handleBulkUploadStudents = async () => {
    setIsUploadingStudents(true);
    try {
      const studentsRef = collection(db, "students");
      const q = query(studentsRef, limit(1));
      const existingSnapshot = await getDocs(q);
      if(!existingSnapshot.empty) {
        toast({ variant: "destructive", title: "Upload Failed", description: "Students collection is not empty. Bulk upload is for initial setup only." });
        setIsUploadingStudents(false);
        return;
      }
      
      const batch = writeBatch(db);
      initialStudents.forEach(student => {
        const docRef = doc(studentsRef);
        batch.set(docRef, student);
      });
      await batch.commit();

      toast({ title: "Success", description: `Successfully added ${initialStudents.length} students.` });
    } catch (error) {
      console.error("Student upload error:", error);
      toast({ variant: "destructive", title: "Error", description: "An error occurred during student upload." });
    } finally {
      setIsUploadingStudents(false);
    }
  };

  const handleBulkUploadSyllabus = async () => {
    setIsUploadingSyllabus(true);
    try {
      const batch = writeBatch(db);
      Object.entries(syllabusData).forEach(([semesterId, data]) => {
          const docRef = doc(db, "syllabus", semesterId);
          batch.set(docRef, data);
      });
      await batch.commit();
      toast({ title: "Success", description: "Syllabus successfully uploaded!" });
    } catch (error) {
      console.error("Syllabus upload error:", error);
      toast({ variant: "destructive", title: "Error", description: "An error occurred during syllabus upload." });
    } finally {
      setIsUploadingSyllabus(false);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Settings /> Data Setup</CardTitle>
          <CardDescription>Use these actions for one-time initial setup of the application data.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><Users /> Bulk Upload Students</CardTitle>
              <CardDescription>Adds the initial list of students to the database from the predefined list.</CardDescription>
            </CardHeader>
            <CardContent>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                       <Button disabled={isUploadingStudents}>{isUploadingStudents ? "Uploading..." : "Run Student Upload"}</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will add {initialStudents.length} students. This should only be run once. Proceed?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleBulkUploadStudents}>Upload</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
          </Card>
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><Book /> Bulk Upload Syllabus</CardTitle>
              <CardDescription>Uploads the complete 6-semester syllabus to the database. This will overwrite existing data.</CardDescription>
            </CardHeader>
            <CardContent>
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                       <Button disabled={isUploadingSyllabus}>{isUploadingSyllabus ? "Uploading..." : "Run Syllabus Upload"}</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                           This will upload the entire syllabus. Any existing syllabus data will be overwritten. Proceed?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleBulkUploadSyllabus}>Upload</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
