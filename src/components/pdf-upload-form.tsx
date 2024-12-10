import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { FileUp } from "lucide-react";
import { z } from "zod";
import * as pdfjsLib from 'pdfjs-dist';

// Set up the worker for pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const pdfUploadSchema = z.object({
  title: z.string().min(1, "Title is required"),
  file: z.instanceof(File, { message: "PDF file is required" })
    .refine((file) => file.type === "application/pdf", "File must be a PDF")
});

interface PdfUploadFormProps {
  onSubmit?: (documentId: string) => void;  // Optional callback for parent component
}

export function PdfUploadForm({ onSubmit }: PdfUploadFormProps) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const extractPdfTitle = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      const metadata = await pdf.getMetadata();
      
      // Try to get title from PDF metadata
      const pdfTitle = (metadata?.info as { Title?: string })?.Title;
      
      if (pdfTitle) {
        // Clean up the title (remove extra whitespace, etc)
        const cleanTitle = pdfTitle.trim();
        if (cleanTitle) {
          setTitle(cleanTitle);
          return;
        }
      }
      
      // If no title in metadata, use filename without extension
      const fileName = file.name.replace(/\.pdf$/i, '');
      setTitle(fileName);
      
    } catch (error) {
      console.error('Error extracting PDF title:', error);
      // Fallback to filename if metadata extraction fails
      const fileName = file.name.replace(/\.pdf$/i, '');
      setTitle(fileName);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      await extractPdfTitle(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a PDF file");
      return;
    }

    const validatedData = pdfUploadSchema.safeParse({ title, file });
    if (!validatedData.success) {
      toast.error(validatedData.error.errors[0].message);
      return;
    }

    setIsUploading(true);
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

      const data = await response.json();
      toast.success("PDF uploaded and processed");

      // Reset form
      setTitle("");
      setFile(null);
      const fileInput = document.getElementById('pdf-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      // Notify parent component if callback provided
      onSubmit?.(data.documentId);

    } catch (error: unknown) {
      console.error(error);
      toast.error("Upload failed", {
        description: error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pdf-file">PDF File</Label>
            <Input
              id="pdf-file"
              type="file"
              onChange={handleFileChange}
              accept=".pdf"
              disabled={isUploading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pdf-title">Title</Label>
            <Input
              id="pdf-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter document title"
              disabled={isUploading}
            />
          </div>

          <Button type="submit" disabled={isUploading} className="w-full">
            {isUploading ? (
              "Uploading..."
            ) : (
              <>
                <FileUp className="mr-2 h-4 w-4" />
                Upload PDF
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 