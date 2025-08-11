"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { type NaanCourse as NaanCourseType } from "@/types";
import { Card } from "@/components/ui/card";
import { Award, Link as LinkIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function NaanView() {
  const [courses, setCourses] = useState<NaanCourseType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const q = query(collection(db, "naanMudhalvanCourses"), orderBy("semester"));
        const querySnapshot = await getDocs(q);
        const fetchedCourses = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as NaanCourseType[];
        setCourses(fetchedCourses);
      } catch (error) {
        console.error("Error fetching Naan Mudhalvan courses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="p-4 sm:p-6">
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-4">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-4/5" />
                  <Skeleton className="h-4 w-2/5" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </Card>
            ))
          : courses.length > 0 ? courses.map((course) => (
              <a key={course.id} href={course.link} target="_blank" rel="noopener noreferrer" className="block">
                <Card className="p-4 h-full hover:border-primary hover:shadow-lg transition-all">
                    <div className="flex justify-between items-start">
                        <Award className="h-8 w-8 text-primary mb-3" />
                        <Badge variant="secondary">Sem {course.semester}</Badge>
                    </div>
                    <h3 className="font-semibold">{course.title}</h3>
                    <p className="text-sm text-muted-foreground">Provider: {course.provider}</p>
                    <p className="text-sm text-primary mt-2 flex items-center gap-1">
                        <LinkIcon className="h-3 w-3" />
                        Go to course
                    </p>
                </Card>
              </a>
            ))
          : !isLoading && <p className="text-muted-foreground col-span-full text-center py-8">No Naan Mudhalvan courses found.</p>
        }
      </div>
    </div>
  );
}
