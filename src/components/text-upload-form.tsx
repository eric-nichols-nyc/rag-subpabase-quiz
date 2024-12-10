import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { z } from "zod";

const textUploadSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string()
    .min(300, "Content must be at least 300 characters long")
    .max(50000, "Content cannot exceed 50,000 characters")
});

export function TextUploadForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const validatedData = textUploadSchema.safeParse({ title, content });
    if (!validatedData.success) {
      setError(validatedData.error.errors[0].message);
      return;
    }

    setIsProcessing(true);
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

      setSuccess(true);
      
      // Reset form
      setTitle("");
      setContent("");
      
    } catch (error: unknown) {
      console.error(error);
      setError(error instanceof Error ? error.message : "Failed to upload text. Please try again later.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter document title"
              disabled={isProcessing}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              placeholder="Enter your text content here..."
              disabled={isProcessing}
              required
            />
            <p className="text-sm text-muted-foreground">
              {content.length < 100 ? "Minimum 100 characters required" : 
               content.length > 50000 ? "Content exceeds maximum length" :
               "Content length acceptable"} ({content.length}/50,000 characters)
            </p>
          </div>

          <Button type="submit" disabled={isProcessing} className="w-full">
            {isProcessing ? "Processing..." : "Process"}
          </Button>

          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="text-sm text-green-600">
              Text content successfully uploaded and processed
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
} 