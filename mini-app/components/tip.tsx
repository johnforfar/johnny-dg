"use client";

import { useState } from "react";
import { useMiniAppContext } from "./context/miniapp-provider";
import { Button } from "./ui/button";
import { Heart, Coins, Zap } from "lucide-react";

interface TipProps {
  postTitle: string;
  postSlug: string;
  authorFid?: number;
}

export function Tip({ postTitle, postSlug }: TipProps) {
  const { sdk, isInMiniApp } = useMiniAppContext();
  const [isTipping, setIsTipping] = useState(false);
  const [tipAmount, setTipAmount] = useState<number | null>(null);

  const tipAmounts = [5, 10, 25, 50, 100];

  const handleTip = async (amount: number) => {
    setIsTipping(true);
    setTipAmount(amount);

    try {
      if (isInMiniApp && sdk) {
        // Use Farcaster Mini App SDK for tipping
        await sdk.actions.composeCast({
          text: `💝 Tip $${amount} to @johnforfar for "${postTitle}"\n\nSupporting great content!`,
          embeds: [`${window.location.origin}/posts/${postSlug}`],
        });
      } else {
        // Fallback: Open external payment or show tip options
        const tipMessage = `💝 Tip $${amount} to @johnforfar for "${postTitle}"\n\nSupporting great content!`;
        
        // Try to share the tip message
        if (navigator.share) {
          await navigator.share({
            title: `Tip $${amount} to @johnforfar`,
            text: tipMessage,
            url: `${window.location.origin}/posts/${postSlug}`,
          });
        } else {
          // Copy tip message to clipboard
          await navigator.clipboard.writeText(`${tipMessage}\n\n${window.location.origin}/posts/${postSlug}`);
          alert(`Tip message copied! Send $${amount} to @johnforfar via your preferred method.`);
        }
      }
    } catch (error) {
      console.error('Failed to send tip:', error);
      alert('Failed to send tip. Please try again.');
    } finally {
      setIsTipping(false);
      setTipAmount(null);
    }
  };

  const handleCustomTip = () => {
    const amount = prompt('Enter tip amount (USD):');
    if (amount && !isNaN(Number(amount)) && Number(amount) > 0) {
      handleTip(Number(amount));
    }
  };

  return (
    <div className="flex flex-col gap-3 p-4 border rounded-lg bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Heart className="w-4 h-4 text-pink-500" />
        <span>Support this post</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {tipAmounts.map((amount) => (
          <Button
            key={amount}
            onClick={() => handleTip(amount)}
            disabled={isTipping}
            variant="outline"
            size="sm"
            className={`flex items-center gap-1 ${
              tipAmount === amount 
                ? 'bg-pink-100 border-pink-300 text-pink-700 dark:bg-pink-900/30 dark:border-pink-700 dark:text-pink-300' 
                : ''
            }`}
          >
            <Coins className="w-3 h-3" />
            <span>${amount}</span>
          </Button>
        ))}
        
        <Button
          onClick={handleCustomTip}
          disabled={isTipping}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          <Zap className="w-3 h-3" />
          <span>Custom</span>
        </Button>
      </div>

      {isInMiniApp && (
        <p className="text-xs text-muted-foreground">
          💡 Tip will be shared as a Farcaster cast
        </p>
      )}
      
      {!isInMiniApp && (
        <p className="text-xs text-muted-foreground">
          💡 Tip message will be shared for you to send via your preferred method
        </p>
      )}
    </div>
  );
}
