"use client";

import { useState, useEffect } from "react";
import { Heart, Repeat2, MessageCircle, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";

interface FarcasterEngagementProps {
  postSlug: string;
  postTitle: string;
  postUrl: string;
}

interface EngagementData {
  likes: number;
  reshares: number;
  comments: number;
  castUrl?: string;
  lastUpdated: string;
}

export function FarcasterEngagement({ postSlug, postTitle, postUrl }: FarcasterEngagementProps) {
  const [engagement, setEngagement] = useState<EngagementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEngagement = async () => {
      try {
        const backendUrl = '';
        const response = await fetch(`${backendUrl}/api/farcaster/engagement/${postSlug}`);
        
        if (response.ok) {
          const data = await response.json();
          setEngagement(data.engagement);
        } else {
          // If no engagement data found, set to null
          setEngagement(null);
        }
      } catch (err) {
        console.error('Failed to fetch Farcaster engagement:', err);
        setError('Failed to load engagement data');
      } finally {
        setLoading(false);
      }
    };

    fetchEngagement();
  }, [postSlug]);

  const handleShareToFarcaster = async () => {
    try {
      const backendUrl = '';
      const response = await fetch(`${backendUrl}/api/farcaster/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postSlug,
          postTitle,
          postUrl,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Post shared to Farcaster! Cast URL: ${data.castUrl}`);
        // Refresh engagement data
        window.location.reload();
      } else {
        alert('Failed to share to Farcaster. Please try again.');
      }
    } catch (err) {
      console.error('Failed to share to Farcaster:', err);
      alert('Failed to share to Farcaster. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
        <span>Loading Farcaster engagement...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-500">
        {error}
      </div>
    );
  }

  if (!engagement) {
    return (
      <div className="flex flex-col gap-3 p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <ExternalLink className="w-4 h-4 text-blue-500" />
          <span>Share on Farcaster</span>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Share this post to Farcaster to track engagement metrics.
        </p>
        
        <Button
          onClick={handleShareToFarcaster}
          variant="outline"
          size="sm"
          className="self-start"
        >
          Share to Farcaster
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-4 border rounded-lg bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <ExternalLink className="w-4 h-4 text-green-500" />
          <span>Farcaster Engagement</span>
        </div>
        
        {engagement.castUrl && (
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-xs"
          >
            <a
              href={engagement.castUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              View Cast
            </a>
          </Button>
        )}
      </div>
      
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <Heart className="w-4 h-4 text-red-500" />
          <span className="font-medium">{engagement.likes}</span>
          <span className="text-muted-foreground">likes</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Repeat2 className="w-4 h-4 text-blue-500" />
          <span className="font-medium">{engagement.reshares}</span>
          <span className="text-muted-foreground">reshares</span>
        </div>
        
        <div className="flex items-center gap-1">
          <MessageCircle className="w-4 h-4 text-green-500" />
          <span className="font-medium">{engagement.comments}</span>
          <span className="text-muted-foreground">comments</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Last updated: {new Date(engagement.lastUpdated).toLocaleString()}
        </p>
        
        <Button
          onClick={handleShareToFarcaster}
          variant="outline"
          size="sm"
          className="text-xs"
        >
          Refresh
        </Button>
      </div>
    </div>
  );
}
