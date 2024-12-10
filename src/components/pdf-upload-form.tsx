import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { FileUp } from "lucide-react";
import { z } from "zod";
import * as pdfjsLib from 'pdfjs-dist';

// Set up the worker for pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

const pdfUploadSchema = z.object({
  title: z.string().min(1, "Title is required"),
  file: z.instanceof(File, { message: "PDF file is required" })
    .refine((file) => file.type === "application/pdf", "File must be a PDF")
    .refine((file) => file.size <= MAX_FILE_SIZE, "File size must be less than 2MB")
});

export function PdfUploadForm() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
    setError(null); // Clear any previous errors
    
    if (selectedFile) {
      // Check file size before processing
      if (selectedFile.size > MAX_FILE_SIZE) {
        setError("File size must be less than 2MB");
        e.target.value = ''; // Reset input
        return;
      }

      setFile(selectedFile);
      await extractPdfTitle(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!file) {
      setError("Please select a PDF file");
      return;
    }

    const validatedData = pdfUploadSchema.safeParse({ title, file });
    if (!validatedData.success) {
      setError(validatedData.error.errors[0].message);
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

      setSuccess(true);

      // Reset form
      setTitle("");
      setFile(null);
      const fileInput = document.getElementById('pdf-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error: unknown) {
      console.error(error);
      setError(error instanceof Error ? error.message : "Failed to upload PDF. Please try again later.");
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
            <p className="text-sm text-muted-foreground">
              Maximum file size: 2MB
            </p>
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

          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="text-sm text-green-600">
              PDF successfully uploaded and processed
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
} 