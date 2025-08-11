"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { type Note as NoteType } from "@/types";
import { Card } from "@/components/ui/card";
import { FileText, Link as LinkIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function NotesView() {
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const q = query(collection(db, "notes"), orderBy("title"));
        const querySnapshot = await getDocs(q);
        const fetchedNotes = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as NoteType[];
        setNotes(fetchedNotes);
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotes();
  }, []);

  return (
    <div className="p-4 sm:p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-3 w-2/5" />
                  </div>
                </div>
              </Card>
            ))
          : notes.length > 0 ? notes.map((note) => (
              <a key={note.id} href={note.link} target="_blank" rel="noopener noreferrer" className="block">
                <Card className="p-4 h-full hover:border-primary hover:shadow-lg transition-all">
                  <div className="flex items-center gap-4">
                    <FileText className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">{note.title}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <LinkIcon className="h-3 w-3" />
                        Click to open link
                      </p>
                    </div>
                  </div>
                </Card>
              </a>
            ))
          : !isLoading && <p className="text-muted-foreground col-span-full text-center py-8">No notes found.</p>
        }
      </div>
    </div>
  );
}
