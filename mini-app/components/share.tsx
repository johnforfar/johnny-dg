"use client";

import { useMiniAppContext } from "./context/miniapp-provider";
import { Button } from "./ui/button";
import { Share2 } from "lucide-react";

interface ShareProps {
  text: string;
  url?: string;
  title?: string;
}

export function Share({ text, url, title }: ShareProps) {
  const { sdk, isInMiniApp, context } = useMiniAppContext();

  const handleFarcasterShare = async () => {
    if (!sdk || !isInMiniApp) {
      // Fallback to regular sharing if not in Farcaster
      if (navigator.share) {
        await navigator.share({
          title: title || 'Check out this post',
          text: text,
          url: url || window.location.href,
        });
      } else {
        // Copy to clipboard as fallback
        await navigator.clipboard.writeText(`${text} ${url || window.location.href}`);
        alert('Link copied to clipboard!');
      }
      return;
    }

    try {
      await sdk.actions.composeCast({
        text: `${text}${url ? `\n\n${url}` : ''}`,
        embeds: url ? [url] : undefined,
      });
    } catch (error) {
      console.error('Failed to share on Farcaster:', error);
      // Fallback to regular sharing
      if (navigator.share) {
        await navigator.share({
          title: title || 'Check out this post',
          text: text,
          url: url || window.location.href,
        });
      }
    }
  };

  return (
    <Button
      onClick={handleFarcasterShare}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      <Share2 className="w-4 h-4" />
      <span>
        {isInMiniApp ? 'Share on Farcaster' : 'Share'}
      </span>
    </Button>
  );
}