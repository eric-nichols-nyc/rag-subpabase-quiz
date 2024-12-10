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
  title: z.string().min(1, "Title is required"),
});

export function UrlUploadForm() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const extractTitleFromUrl = async (url: string) => {
    try {
      const response = await fetch(url);
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      
      // Try to get title from OpenGraph meta tag first
      const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content');
      if (ogTitle) {
        setTitle(ogTitle);
        return;
      }
      
      // Fallback to regular title tag
      const pageTitle = doc.title;
      if (pageTitle) {
        setTitle(pageTitle);
        return;
      }

      // If no title found, use the URL's pathname as fallback
      const urlObj = new URL(url);
      const pathName = urlObj.pathname.split('/').filter(Boolean).pop() || urlObj.hostname;
      setTitle(decodeURIComponent(pathName));
      
    } catch (error) {
      console.error('Error extracting title:', error);
      // Use URL as fallback if extraction fails
      const urlObj = new URL(url);
      const pathName = urlObj.pathname.split('/').filter(Boolean).pop() || urlObj.hostname;
      setTitle(decodeURIComponent(pathName));
    }
  };

  const handleUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    
    if (newUrl && newUrl.startsWith('http')) {
      try {
        new URL(newUrl); // Validate URL
        await extractTitleFromUrl(newUrl);
      } catch (error) {
        console.error('Error validating URL:', error);
        // Invalid URL, ignore
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validatedData = urlSchema.safeParse({ url, title });
    if (!validatedData.success) {
      toast.error(validatedData.error.errors[0].message);
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          url: validatedData.data.url, 
          title: validatedData.data.title 
        }),
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

      // Reset form
      setUrl("");
      setTitle("");

    } catch (error: unknown) {
      console.error(error);
      toast.error("Processing failed", {
        description: error instanceof Error 
          ? error.message 
          : "Please try again later. If the problem persists, try a different URL.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              Enter URL
            </Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={handleUrlChange}
              placeholder="https://example.com/article or YouTube URL"
              className="flex-1"
              disabled={isProcessing}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url-title">Title</Label>
            <Input
              id="url-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter document title"
              disabled={isProcessing}
              required
            />
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

          <Button type="submit" disabled={isProcessing} className="w-full">
            {isProcessing ? "Processing..." : "Process"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
