"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Share } from "@/components/share";
import { Tip } from "@/components/tip";
import { FarcasterEngagement } from "@/components/farcaster-engagement";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface PostData {
  slug: string;
  content: string;
  metadata: {
    title: string;
    date: string;
    tags: string[];
    categories: string[];
    coverImage: string;
    coverImageExists: boolean;
    summary: string;
  };
}

export default function PostPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isLocalhost = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return ['localhost','127.0.0.1'].includes(window.location.hostname);
  }, []);

  async function saveDraftOnce() {
    if (!isLocalhost || !post) return;
    try {
      setSaving(true);
      setSaveMsg('Saving...');
      const currentDomain = window.location.hostname;
      const res = await fetch(`/api/posts/${slug}?domain=${encodeURIComponent(currentDomain)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: draft, metadata: post?.metadata || {} })
      });
      if (!res.ok) throw new Error(await res.text());
      setSaveMsg('Autosaved');
    } catch (e) {
      setSaveMsg('Autosave failed');
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const backendUrl = '';
        const currentDomain = window.location.hostname;
        const apiUrl = `${backendUrl}/api/posts/${slug}?domain=${encodeURIComponent(currentDomain)}`;
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Failed to fetch post: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        setPost(data);
        setDraft(data.content || "");
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch post');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    } else {
      setError('No post slug provided');
      setLoading(false);
    }
  }, [slug]);

  // Autosave with debounce when editing and draft changes
  useEffect(() => {
    if (!isEditing) return;
    if (!isLocalhost) return;
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = setTimeout(() => {
      void saveDraftOnce();
    }, 800);
    return () => {
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    };
  }, [draft, isEditing, isLocalhost]);

  // Load Twitter widgets script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    script.charset = 'utf-8';
    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  if (loading) {
    return (
      <main className="container mx-auto px-2 sm:px-4 py-8 max-w-4xl">
        <div className="text-center">Loading post...</div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="container mx-auto px-2 sm:px-4 py-8 max-w-4xl">
        <div className="text-center text-red-500">
          Error: {error || 'Post not found'}
        </div>
        <div className="text-center mt-4">
          <Button asChild>
            <Link href="/">Back to Posts</Link>
          </Button>
        </div>
      </main>
    );
  }

  const shareText = `Check out "${post.metadata.title}" on MemGraph!`;

  return (
    <main className="container mx-auto px-2 sm:px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Button asChild variant="outline" className="mb-4">
          <Link href="/">← Back to Posts</Link>
        </Button>
        
        <div className="flex items-center justify-between gap-4 mb-4">
          <h1 className="text-4xl font-bold">{post.metadata.title}</h1>
          {/* Local-only Edit button for specific post */}
          {isLocalhost && slug === 'deploy-ai-to-bare-metal-save-money' && (
            <Button
              variant={isEditing ? "secondary" : "default"}
              onClick={() => setIsEditing((v) => !v)}
            >
              {isEditing ? 'Close Editor' : 'Edit Post'}
            </Button>
          )}
        </div>
        
        <p className="text-muted-foreground mb-4">{post.metadata.date}</p>
        
        {post.metadata.coverImageExists && post.metadata.coverImage && (
          <img
            src={`/api/images/${post.metadata.coverImage}`}
            alt={post.metadata.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}
        
        {post.metadata.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.metadata.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Share 
            text={shareText}
            url={`${window.location.origin}/posts/${slug}`}
            title={post.metadata.title}
          />
          <Button asChild variant="outline">
            <Link href="/">Home</Link>
          </Button>
        </div>
        
        <Tip 
          postTitle={post.metadata.title}
          postSlug={slug}
          authorFid={12345} // Your Farcaster FID
        />
        
        <FarcasterEngagement 
          postSlug={slug}
          postTitle={post.metadata.title}
          postUrl={`${window.location.origin}/posts/${slug}`}
        />
      </div>
      
      {!isEditing && (
      <article className="prose prose-lg max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            p: ({ children }) => {
              // Check if paragraph contains only a URL
              const text = children?.toString() || '';
              const youtubeMatch = text.match(/https:\/\/youtu\.be\/([a-zA-Z0-9_-]+)/) || text.match(/https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
              const twitterMatch = text.match(/https:\/\/twitter\.com\/\w+\/status\/(\d+)/);
              
              if (youtubeMatch) {
                const videoId = youtubeMatch[1];
                return (
                  <div className="my-6">
                    <iframe
                      width="560"
                      height="315"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full max-w-2xl mx-auto rounded-lg"
                    ></iframe>
                  </div>
                );
              }
              
              if (twitterMatch) {
                const tweetId = twitterMatch[1];
                return (
                  <div className="my-6">
                    <blockquote className="twitter-tweet" data-theme="dark">
                      <a href={text}></a>
                    </blockquote>
                  </div>
                );
              }
              
              return (
                <p className="mb-4 text-foreground leading-relaxed">
                  {children}
                </p>
              );
            },
            img: ({ src, alt, title }) => {
              const backendUrl = '';
              const imageSrc = (typeof src === 'string' && src.startsWith('http')) ? src : `${backendUrl}/images/${src}`;
              return (
                <img 
                  src={imageSrc} 
                  alt={alt || ''} 
                  title={title || ''} 
                  className="max-w-full h-auto rounded-lg my-4" 
                />
              );
            },
            table: ({ children }) => (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-border">
                  {children}
                </table>
              </div>
            ),
            th: ({ children }) => (
              <th className="border border-border px-4 py-2 bg-muted font-semibold text-left">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border border-border px-4 py-2">
                {children}
              </td>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-border pl-4 italic text-muted-foreground my-4">
                {children}
              </blockquote>
            ),
            code: ({ children, className }) => {
              const isInline = !className;
              if (isInline) {
                return (
                  <code className="bg-muted px-1 py-0.5 rounded text-sm">
                    {children}
                  </code>
                );
              }
              return (
                <code className={className}>
                  {children}
                </code>
              );
            },
                  pre: ({ children }) => (
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-4">
                      {children}
                    </pre>
                  ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside my-4 space-y-1">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside my-4 space-y-1">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="ml-4">
                {children}
              </li>
            ),
            h1: ({ children }) => (
              <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-2xl font-bold mt-6 mb-3 text-foreground">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-xl font-bold mt-4 mb-2 text-foreground">
                {children}
              </h3>
            ),
            a: ({ href, children }) => (
              <a 
                href={href} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                {children}
              </a>
            ),
            figure: ({ children }) => {
              // Helper function to extract text content from React children
              const extractTextFromChildren = (children: React.ReactNode): string => {
                if (typeof children === 'string') {
                  return children;
                }
                if (typeof children === 'number') {
                  return children.toString();
                }
                if (Array.isArray(children)) {
                  return children.map(extractTextFromChildren).join(' ');
                }
                if (children && typeof children === 'object' && 'props' in children) {
                  return extractTextFromChildren((children as { props: { children: React.ReactNode } }).props.children);
                }
                return '';
              };

              // Check if figure contains YouTube or Twitter URLs
              const figureText = extractTextFromChildren(children);
              const youtubeMatch = figureText.match(/https:\/\/youtu\.be\/([a-zA-Z0-9_-]+)/) || figureText.match(/https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
              const twitterMatch = figureText.match(/https:\/\/twitter\.com\/\w+\/status\/(\d+)/);
              
              if (youtubeMatch) {
                const videoId = youtubeMatch[1];
                // Extract caption text from children
                const captionText = figureText.replace(/https:\/\/[^\s]+/g, '').trim();
                return (
                  <figure className="my-6">
                    <iframe
                      width="560"
                      height="315"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full max-w-2xl mx-auto rounded-lg"
                    ></iframe>
                    {captionText && (
                      <figcaption className="text-sm text-muted-foreground text-center mt-2 italic">
                        {captionText}
                      </figcaption>
                    )}
                  </figure>
                );
              }
              
              if (twitterMatch) {
                return (
                  <figure className="my-6">
                    <blockquote className="twitter-tweet" data-theme="dark">
                      <a href={twitterMatch[0]}></a>
                    </blockquote>
                    {children}
                  </figure>
                );
              }
              
              return (
                <figure className="my-6">
                  {children}
                </figure>
              );
            },
            figcaption: ({ children }) => (
              <figcaption className="text-sm text-muted-foreground text-center mt-2 italic">
                {children}
              </figcaption>
            ),
          }}
        >
          {post.content}
        </ReactMarkdown>
      </article>
      )}

      {isEditing && (
        <section className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">Inline Editor (local only)</h2>
            <div className="text-sm text-muted-foreground">{saveMsg}</div>
          </div>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full h-80 p-3 border rounded-md font-mono text-sm"
          />
          <div className="flex gap-2 mt-3">
            {isLocalhost && (
              <Button
                variant="secondary"
                disabled={saving}
                onClick={async () => {
                  try {
                    setSaving(true);
                    setSaveMsg('Generating...');
                    const res = await fetch('/api/ai/edit', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ title: post?.metadata?.title || '', content: draft })
                    });
                    if (!res.ok) throw new Error(await res.text());
                    const data = await res.json();
                    if (typeof data.suggestion === 'string' && data.suggestion.trim().length > 0) {
                      setDraft(data.suggestion);
                      setSaveMsg('AI suggestion applied');
                    } else {
                      setSaveMsg('AI returned no suggestion');
                    }
                  } catch (e) {
                    setSaveMsg('AI generation failed');
                  } finally {
                    setSaving(false);
                  }
                }}
              >
                AI Improve
              </Button>
            )}
            <Button
              disabled={saving}
              onClick={async () => {
                await saveDraftOnce();
                // Reflect changes immediately in view without refresh
                setPost((prev) => prev ? { ...prev, content: draft } as PostData : prev);
                setIsEditing(false);
              }}
            >
              {saving ? 'Saving...' : 'Save & Close'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // Exit editor and reflect latest draft in rendered view
                setPost((prev) => prev ? { ...prev, content: draft } as PostData : prev);
                setIsEditing(false);
              }}
            >
              Close
            </Button>
          </div>
        </section>
      )}
      
      <div className="mt-12 pt-8 border-t">
        <div className="flex gap-4">
          <Share text={shareText} />
          <Button asChild variant="outline">
            <Link href="/posts">More Posts</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
