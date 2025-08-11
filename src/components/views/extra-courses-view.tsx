"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { type ExtraCourse as ExtraCourseType } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Link as LinkIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ExtraCoursesView() {
  const [courses, setCourses] = useState<ExtraCourseType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const q = query(collection(db, "extraCourses"), orderBy("title"));
        const querySnapshot = await getDocs(q);
        const fetchedCourses = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as ExtraCourseType[];
        setCourses(fetchedCourses);
      } catch (error) {
        console.error("Error fetching extra courses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="p-4 sm:p-6">
       <div className="grid gap-4 md:grid-cols-2">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-6 w-3/5 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5 mt-1" />
              </Card>
            ))
          : courses.length > 0 ? courses.map((course) => (
              <a key={course.id} href={course.link} target="_blank" rel="noopener noreferrer" className="block">
                <Card className="h-full hover:border-primary hover:shadow-lg transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-start gap-3">
                      <BookOpen className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                      <span>{course.title}</span>
                    </CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <p className="text-sm text-primary flex items-center gap-1">
                        <LinkIcon className="h-3 w-3" />
                        Learn more
                    </p>
                  </CardContent>
                </Card>
              </a>
            ))
          : !isLoading && <p className="text-muted-foreground col-span-full text-center py-8">No extra courses found.</p>
        }
      </div>
    </div>
  );
}
