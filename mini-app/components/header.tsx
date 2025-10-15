import Link from "next/link";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="flex flex-col lg:flex-row items-center justify-between border-b px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Left side - Title */}
      <div className="mb-3 lg:mb-0">
        <Link href="/" className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
          Johnny&apos;s Blog
        </Link>
      </div>
      
      {/* Center - Tagline */}
      <div className="mb-3 lg:mb-0 lg:flex-1 lg:flex lg:justify-center">
        <p className="text-muted-foreground text-xs sm:text-sm italic text-center">
          Sharing knowledge &amp; BUIDLing in AI &amp; Web3 technology.
        </p>
      </div>
      <nav className="flex items-center space-x-1 sm:space-x-2">
        <ThemeToggle />
        <Button variant="ghost" asChild className="px-2 sm:px-3 py-1 sm:py-2">
          <Link 
            href="https://x.com/johnforfar" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors flex items-center gap-1 sm:gap-2"
            title="Follow @johnforfar on X"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span className="text-xs sm:text-sm font-medium hidden xs:inline">Follow</span>
          </Link>
        </Button>
        <Button variant="ghost" asChild className="px-2 sm:px-3 py-1 sm:py-2">
          <Link 
            href="https://youtube.com/@John-Forfar" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-red-500 hover:text-red-400 transition-colors flex items-center gap-1 sm:gap-2"
            title="Subscribe to Johnny's YouTube"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span className="text-xs sm:text-sm font-medium hidden xs:inline">Subscribe</span>
          </Link>
        </Button>
        <Button variant="ghost" asChild className="px-2 sm:px-3 py-1 sm:py-2">
          <Link 
            href="https://github.com/johnforfar" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors flex items-center gap-1 sm:gap-2"
            title="Follow @johnforfar on GitHub"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span className="text-xs sm:text-sm font-medium hidden xs:inline">Follow</span>
          </Link>
        </Button>
        <Button variant="ghost" asChild className="px-2 sm:px-3 py-1 sm:py-2">
          <Link 
            href="https://www.tiktok.com/@john.forfar" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-pink-500 hover:text-pink-600 dark:text-pink-400 dark:hover:text-pink-300 transition-colors flex items-center gap-1 sm:gap-2"
            title="Follow @john.forfar on TikTok"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
            </svg>
            <span className="text-xs sm:text-sm font-medium hidden xs:inline">Follow</span>
          </Link>
        </Button>
        <Button variant="ghost" asChild className="px-2 sm:px-3 py-1 sm:py-2">
          <Link 
            href="https://www.linkedin.com/in/johnforfar/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors flex items-center gap-1 sm:gap-2"
            title="Connect with John Forfar on LinkedIn"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            <span className="text-xs sm:text-sm font-medium hidden xs:inline">Connect</span>
          </Link>
        </Button>
        {/* Farcaster Profile Button */}
        <Button variant="ghost" asChild className="px-2 sm:px-3 py-1 sm:py-2">
          <Link 
            href="https://farcaster.xyz/johnforfar" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors flex items-center gap-1 sm:gap-2"
            title="Follow @johnforfar on Farcaster"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-6h2v-8h-2v8zm0-10h2v2h-2V6z"/>
            </svg>
            <span className="text-xs sm:text-sm font-medium hidden xs:inline">Farcaster</span>
          </Link>
        </Button>
      </nav>
    </header>
  );
}
