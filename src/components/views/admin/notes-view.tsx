"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db, addDoc, deleteDoc, doc } from "@/lib/firebase";
import { type Note } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

export default function AdminNotesView() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newLink, setNewLink] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, "notes"), orderBy("title"));
      const querySnapshot = await getDocs(q);
      const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Note[];
      setNotes(fetched);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not fetch notes." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "notes"), { title: newTitle, link: newLink });
      setNewTitle("");
      setNewLink("");
      toast({ title: "Success", description: "Note added." });
      fetchNotes();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to add note." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteDoc(doc(db, "notes", noteId));
      toast({ title: "Success", description: "Note deleted." });
      setNotes(notes.filter(n => n.id !== noteId));
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete note." });
    }
  };
  
  return (
    <div className="p-4 sm:p-6 space-y-6">
      <Card>
        <CardHeader><CardTitle>Add New Note</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleAddNote} className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2"><Label htmlFor="new-title">Note Title</Label><Input id="new-title" value={newTitle} onChange={e => setNewTitle(e.target.value)} required disabled={isSubmitting}/></div>
            <div className="space-y-2"><Label htmlFor="new-link">Google Drive Link</Label><Input id="new-link" type="url" value={newLink} onChange={e => setNewLink(e.target.value)} required disabled={isSubmitting}/></div>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Adding..." : "Add Note"}</Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle>Existing Notes</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Link</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={3} className="text-center">Loading...</TableCell></TableRow>
              ) : notes.length > 0 ? (
                notes.map(note => (
                  <TableRow key={note.id}>
                    <TableCell>{note.title}</TableCell>
                    <TableCell><a href={note.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View Note</a></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteNote(note.id)}><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={3} className="text-center">No notes found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
