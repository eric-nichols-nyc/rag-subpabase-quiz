"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UrlUploadForm } from "@/components/url-upload-form";
import { toast } from "sonner";
import { z } from "zod";

const uploadSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    content: z.string().optional(),
    file: z.any().optional(),
    url: z.string().url().optional(),
  })
  .refine(
    (data) => {
      const hasContent = data.content && data.content.trim().length > 0;
      const hasFile = data.file !== null;
      const hasUrl = data.url && data.url.trim().length > 0;
      return hasContent || hasFile || hasUrl;
    },
    {
      message: "Either content, file, or URL must be provided",
    }
  );

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    // validate the form data
    const validatedData = uploadSchema.safeParse({ title, content, file, url });
    if (!validatedData.success) {
      console.log("validatedData.error = ", validatedData.error);
      toast.error(validatedData.error.errors[0].message);
      return;
    }

    formData.append("title", validatedData.data.title);
    if (validatedData.data.content)
      formData.append("content", validatedData.data.content);
    if (validatedData.data.file)
      formData.append("file", validatedData.data.file);
    if (validatedData.data.url) formData.append("url", validatedData.data.url);

    try {
      setIsUploading(true);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Upload failed");
      }

      toast.success("Document uploaded and processed");
      // Reset form
      setTitle("");
      setContent("");
      setFile(null);
      setUrl("");
    } catch (error: unknown) {
      console.error(error);
      toast.error("Upload failed", {
        description:
          error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlSubmit = async (url: string) => {
    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Processing failed");
      }
      setTitle("")
      toast.success(
        url.includes("youtube.com") || url.includes("youtu.be")
          ? "YouTube transcript processed and stored"
          : "URL content processed and stored"
      );

      return true; // Return true on success
    } catch (error: unknown) {
      console.error(error);
      toast.error("Processing failed", {
        description:
          error instanceof Error
            ? error.message
            : "Please try again later. If the problem persists, try a different URL.",
      });
      return false; // Return false on failure
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto mt-8 p-4">
        <h1 className="text-3xl font-bold mb-6">Upload Document</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-6">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="text">Text Content</TabsTrigger>
              <TabsTrigger value="pdf">PDF Upload</TabsTrigger>
              <TabsTrigger value="url">URL</TabsTrigger>
            </TabsList>

            <TabsContent value="text">
              <div className="space-y-4">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={5}
                  placeholder="Enter your text content here..."
                />
                <Button type="submit" disabled={isUploading} className="mt-6">
                  {isUploading ? "Processing..." : "Process"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="pdf">
              <div className="space-y-4">
                <Label htmlFor="file">PDF File</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  accept=".pdf"
                />
                <Button type="submit" disabled={isUploading} className="mt-6">
                  {isUploading ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="url">
              <div className="space-y-4">
                <Label htmlFor="url">Website URL</Label>
                <UrlUploadForm onSubmit={handleUrlSubmit} />
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </main>
    </div>
  );
}
