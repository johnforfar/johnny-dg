import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about Johnny's Blog and the mission to share AI-powered insights on Solana blockchain development.",
};

export default function About() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">About Johnny&apos;s Blog</h1>
          <p className="text-lg text-muted-foreground">
            AI-powered insights on Solana blockchain development, technology, and innovation.
          </p>
        </div>
        
        <div className="prose prose-lg max-w-none">
          <h2>Our Mission</h2>
          <p>
            We&apos;re dedicated to sharing knowledge and building the future of Web3. Through detailed tutorials, 
            insights, and analysis, we help developers and enthusiasts understand the Solana ecosystem and 
            blockchain technology.
          </p>
          
          <h2>What We Cover</h2>
          <ul>
            <li>Solana blockchain development</li>
            <li>DeFi protocols and applications</li>
            <li>NFT marketplaces and tools</li>
            <li>Web3 innovation and trends</li>
            <li>Developer tutorials and guides</li>
          </ul>
          
          <h2>Connect With Us</h2>
          <p>
            Follow our journey as we explore the cutting edge of blockchain technology and help build 
            the decentralized future.
          </p>
        </div>
        
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/posts">View Posts</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
