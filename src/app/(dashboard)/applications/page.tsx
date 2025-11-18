"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getAuthClient } from "@/lib/firebase";
import { addApplication, listApplications, type Application } from "@/lib/db";

export default function ApplicationsPage() {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [url, setUrl] = useState("");
  interface ApplicationItem extends Application { id: string }
  const [items, setItems] = useState<ApplicationItem[]>([]);

  const refresh = async () => {
    const user = getAuthClient().currentUser;
    if (!user) return;
    const apps = await listApplications(user.uid);
    setItems(apps);
  };

  // Load applications explicitly to avoid setState inside useEffect lint issues

  const onAdd = async () => {
    const user = getAuthClient().currentUser;
    if (!user) return;
    await addApplication(user.uid, { title, company, url });
    setTitle("");
    setCompany("");
    setUrl("");
    refresh();
  };

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Track Applications</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <Input placeholder="Job title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Input placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
          <Input placeholder="Link" value={url} onChange={(e) => setUrl(e.target.value)} />
          <div className="flex gap-2">
            <Button onClick={onAdd}>Add</Button>
            <Button variant="outline" onClick={refresh}>Load</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>My Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm space-y-2">
            {items.map((i) => (
              <li key={i.id}>
                <span className="font-medium">{i.title}</span> · {i.company} · {i.url}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}