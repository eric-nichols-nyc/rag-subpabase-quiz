"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UrlUploadForm } from "@/components/url-upload-form";
import { TextUploadForm } from "@/components/text-upload-form";
import { PdfUploadForm } from "@/components/pdf-upload-form";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();

  const handleDocumentUploaded = (documentId: string) => {
    // Optionally handle successful upload, e.g., redirect to the document page
    router.push(`/documents/${documentId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto mt-8 p-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-3">Upload Document</h1>
          <p className="text-muted-foreground mb-6">
            Upload your learning materials in various formats. You can paste text directly, 
            upload PDF documents, or provide a URL to web content or YouTube videos. 
            Your uploaded content will be processed and made available for generating 
            custom quizzes.
          </p>

          <Tabs defaultValue="url" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="url">URL</TabsTrigger>
              <TabsTrigger value="text">Text Content</TabsTrigger>
              <TabsTrigger value="pdf">PDF Upload</TabsTrigger>
            </TabsList>

            <TabsContent value="text">
              <TextUploadForm onSubmit={handleDocumentUploaded} />
            </TabsContent>

            <TabsContent value="pdf">
              <PdfUploadForm onSubmit={handleDocumentUploaded} />
            </TabsContent>

            <TabsContent value="url">
              <UrlUploadForm onSubmit={handleDocumentUploaded} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
