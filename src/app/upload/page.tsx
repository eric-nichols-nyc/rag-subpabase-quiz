"use client";

import { Header } from "@/components/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UrlUploadForm } from "@/components/url-upload-form";
import { TextUploadForm } from "@/components/text-upload-form";
import { PdfUploadForm } from "@/components/pdf-upload-form";
import { toast } from "sonner";

export default function UploadPage() {
  const handleTextSubmit = async (title: string, content: string) => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Upload failed");
      }

      toast.success("Document uploaded and processed");
      return true;
    } catch (error: unknown) {
      console.error(error);
      toast.error("Upload failed", {
        description:
          error instanceof Error ? error.message : "Please try again later.",
      });
      return false;
    }
  };

  const handleUrlSubmit = async (url: string, title: string) => {
    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, title }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Processing failed");
      }

      toast.success(
        url.includes("youtube.com") || url.includes("youtu.be")
          ? "YouTube transcript processed and stored"
          : "URL content processed and stored"
      );

      return true;
    } catch (error: unknown) {
      console.error(error);
      toast.error("Processing failed", {
        description:
          error instanceof Error
            ? error.message
            : "Please try again later. If the problem persists, try a different URL.",
      });
      return false;
    }
  };

  const handlePdfSubmit = async (title: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Upload failed");
      }

      toast.success("PDF uploaded and processed");
      return true;
    } catch (error: unknown) {
      console.error(error);
      toast.error("Upload failed", {
        description:
          error instanceof Error ? error.message : "Please try again later.",
      });
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto mt-8 p-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-3">Upload Document</h1>
          <p className="text-muted-foreground mb-6">
            Upload your learning materials in various formats. You can paste text directly, 
            upload PDF documents, or provide a URL to web content or YouTube videos. 
            Your uploaded content will be processed and made available for generating 
            custom quizzes.
          </p>

          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="text">Text Content</TabsTrigger>
              <TabsTrigger value="pdf">PDF Upload</TabsTrigger>
              <TabsTrigger value="url">URL</TabsTrigger>
            </TabsList>

            <TabsContent value="text">
              <TextUploadForm onSubmit={handleTextSubmit} />
            </TabsContent>

            <TabsContent value="pdf">
              <PdfUploadForm onSubmit={handlePdfSubmit} />
            </TabsContent>

            <TabsContent value="url">
              <UrlUploadForm onSubmit={handleUrlSubmit} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
