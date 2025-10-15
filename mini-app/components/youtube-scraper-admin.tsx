"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Loader2, Youtube, Plus } from "lucide-react";

interface VideoData {
  title: string;
  duration: string;
  description?: string;
  thumbnail?: string;
  viewCount?: number;
}

interface ScrapeResult {
  success: boolean;
  video?: VideoData;
  slug?: string;
  filename?: string;
  message?: string;
  error?: string;
}

export function YouTubeScraperAdmin() {
  const [videoUrl, setVideoUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScrapeResult | null>(null);

  const handleCreatePost = async () => {
    if (!videoUrl.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
        const backendUrl = '';
      const response = await fetch(`${backendUrl}/api/youtube/create-post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
            body: JSON.stringify({ 
              videoUrl, 
              title: title.trim() || undefined,
              description: description.trim() || undefined,
              publishDate: publishDate.trim() || undefined
            }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create blog post'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Youtube className="w-5 h-5 text-red-600" />
          YouTube Video Scraper
        </CardTitle>
        <CardDescription>
          Create blog posts from YouTube videos with embedded video and custom descriptions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="video-url" className="text-sm font-medium">
            YouTube Video URL
          </label>
          <div className="flex gap-2">
            <Input
              id="video-url"
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleCreatePost} 
              disabled={isLoading || !videoUrl.trim()}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              Create Post
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Blog Post Title (Optional)
          </label>
          <Input
            id="title"
            type="text"
            placeholder="Custom title for the blog post"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description (Optional)
              </label>
              <textarea
                id="description"
                placeholder="Custom description for the blog post"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="publish-date" className="text-sm font-medium">
                Publish Date (Optional)
              </label>
              <Input
                id="publish-date"
                type="date"
                placeholder="YYYY-MM-DD"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
              />
            </div>

        {result && (
          <Alert className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            <AlertDescription className={result.success ? "text-green-800" : "text-red-800"}>
              {result.success ? (
                <div className="space-y-2">
                  <p className="font-medium">✅ {result.message}</p>
                  {result.video && (
                    <div className="text-sm space-y-1">
                      <p><strong>Title:</strong> {result.video.title}</p>
                      <p><strong>Duration:</strong> {result.video.duration}</p>
                      <p><strong>Views:</strong> {result.video.viewCount?.toLocaleString()}</p>
                      <p><strong>Slug:</strong> {result.slug}</p>
                      <p><strong>File:</strong> {result.filename}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <p className="font-medium">❌ Error</p>
                  <p>{result.error}</p>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Supported URLs:</strong></p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>https://www.youtube.com/watch?v=VIDEO_ID</li>
            <li>https://youtu.be/VIDEO_ID</li>
            <li>https://www.youtube.com/shorts/VIDEO_ID</li>
          </ul>
          <p className="mt-2">
            <strong>Note:</strong> Creates a blog post with embedded YouTube video and custom content. The video will be embedded directly in the post.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
