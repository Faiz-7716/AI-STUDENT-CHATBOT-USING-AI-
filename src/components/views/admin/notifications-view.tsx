"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db, addDoc, serverTimestamp } from "@/lib/firebase";
import { type Notification } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Bell } from "lucide-react";

export default function AdminNotificationsView() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchNotifications = async () => {
      try {
        const q = query(collection(db, "notifications"), orderBy("timestamp", "desc"), limit(5));
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Notification[];
        setNotifications(fetched);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not fetch notifications." });
      }
    };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handlePostNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setIsLoading(true);
    try {
      await addDoc(collection(db, "notifications"), { message: newMessage, timestamp: serverTimestamp() });
      setNewMessage("");
      toast({ title: "Success", description: "Notification posted." });
      fetchNotifications();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to post notification." });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="p-4 sm:p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Post New Notification</CardTitle>
          <CardDescription>This message will be shown as a banner to all students.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePostNotification} className="space-y-4">
            <Textarea
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Enter your notification message..."
              rows={4}
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>{isLoading ? "Posting..." : "Post Notification"}</Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div key={n.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                  <Bell className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p>{n.message}</p>
                    <p className="text-sm text-muted-foreground">
                      {n.timestamp?.toDate().toLocaleString() || "Just now"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8">No recent notifications.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
