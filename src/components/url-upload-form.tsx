import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { AlertCircle, Link, Youtube } from "lucide-react";
import { z } from "zod";
import { isYoutubeUrl } from '@/lib/utils';

const urlSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
});

interface UrlUploadFormProps {
  onSubmit: (url: string) => Promise<boolean>;
}

export function UrlUploadForm({ onSubmit }: UrlUploadFormProps) {
  const [url, setUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate URL
    const validatedData = urlSchema.safeParse({ url });
    if (!validatedData.success) {
      toast.error(validatedData.error.errors[0].message);
      return;
    }

    setIsProcessing(true);
    try {
      const success = await onSubmit(validatedData.data.url);
      if (success) {
        setUrl("");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
          <div className="space-y-2">
            <Label htmlFor="url" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              Enter URL
            </Label>
            <div className="flex gap-2">
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/article or YouTube URL"
                className="flex-1"
                disabled={isProcessing}
              />
              <Button onClick={handleSubmit} disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Process"}
              </Button>
            </div>
          </div>

          {/* Dynamic info message based on URL type */}
          {url && (
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              {isYoutubeUrl(url) ? (
                <>
                  <Youtube className="h-4 w-4 mt-0.5" />
                  <span>
                    YouTube video detected. The transcript will be extracted and
                    processed.
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 mt-0.5" />
                  <span>Web page content will be extracted and processed.</span>
                </>
              )}
            </div>
          )}
      </CardContent>
    </Card>
  );
}
