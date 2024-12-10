import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { z } from "zod";

const textUploadSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string()
    .min(300, "Content must be at least 300 characters long")
    .max(50000, "Content cannot exceed 50,000 characters")
});

interface TextUploadFormProps {
  onSubmit: (title: string, content: string) => Promise<boolean>;
}

export function TextUploadForm({ onSubmit }: TextUploadFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validatedData = textUploadSchema.safeParse({ title, content });
    if (!validatedData.success) {
      toast.error(validatedData.error.errors[0].message);
      return;
    }

    setIsProcessing(true);
    try {
      const success = await onSubmit(title, content);
      if (success) {
        setTitle("");
        setContent("");
      }
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
        </form>
      </CardContent>
    </Card>
  );
} 