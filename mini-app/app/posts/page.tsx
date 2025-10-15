"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Share } from "@/components/share";

interface Post {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  categories: string[];
  coverImage: string;
  thumbnailExists: boolean;
  summary: string;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<"date" | "title">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const backendUrl = '';
        const currentDomain = window.location.hostname;
        const apiUrl = `${backendUrl}/api/posts?domain=${encodeURIComponent(currentDomain)}`;
        console.log('Fetching posts from:', apiUrl);
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
          credentials: 'omit'
        });
        
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
          throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Posts data:', data.length, 'posts received');
        setPosts(data);
      } catch (err) {
        console.error('Error fetching posts:', err);
        console.error('Error details:', {
          name: err instanceof Error ? err.name : 'Unknown',
          message: err instanceof Error ? err.message : 'Unknown error',
          stack: err instanceof Error ? err.stack : 'No stack'
        });
        setError(err instanceof Error ? err.message : 'Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Get all unique tags from posts
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach(post => {
      post.tags.forEach(tag => {
        // Handle tags that might be stringified arrays
        if (typeof tag === 'string' && tag.startsWith('[') && tag.endsWith(']')) {
          try {
            const parsedTags = JSON.parse(tag);
            if (Array.isArray(parsedTags)) {
              parsedTags.forEach(t => tagSet.add(t));
            } else {
              tagSet.add(tag);
            }
          } catch {
            tagSet.add(tag);
          }
        } else {
          tagSet.add(tag);
        }
      });
    });
    return Array.from(tagSet).sort();
  }, [posts]);

  // Get all unique categories from posts
  const allCategories = useMemo(() => {
    const categorySet = new Set<string>();
    posts.forEach(post => {
      post.categories.forEach(category => {
        // Handle categories that might be stringified arrays
        if (typeof category === 'string' && category.startsWith('[') && category.endsWith(']')) {
          try {
            const parsedCategories = JSON.parse(category);
            if (Array.isArray(parsedCategories)) {
              parsedCategories.forEach(c => categorySet.add(c));
            } else {
              categorySet.add(category);
            }
          } catch {
            categorySet.add(category);
          }
        } else {
          categorySet.add(category);
        }
      });
    });
    return Array.from(categorySet).sort();
  }, [posts]);

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    const filtered = posts.filter(post => {
      // Filter by tag
      const tagMatch = !selectedTag || post.tags.some(tag => {
        // Handle stringified arrays
        if (typeof tag === 'string' && tag.startsWith('[') && tag.endsWith(']')) {
          try {
            const parsedTags = JSON.parse(tag);
            return Array.isArray(parsedTags) ? parsedTags.includes(selectedTag) : tag === selectedTag;
          } catch {
            return tag === selectedTag;
          }
        }
        return tag === selectedTag;
      });

      // Filter by category
      const categoryMatch = !selectedCategory || post.categories.some(category => {
        // Handle stringified arrays
        if (typeof category === 'string' && category.startsWith('[') && category.endsWith(']')) {
          try {
            const parsedCategories = JSON.parse(category);
            return Array.isArray(parsedCategories) ? parsedCategories.includes(selectedCategory) : category === selectedCategory;
          } catch {
            return category === selectedCategory;
          }
        }
        return category === selectedCategory;
      });

      return tagMatch && categoryMatch;
    });

    // Sort posts
    filtered.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === "date") {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === "title") {
        comparison = a.title.localeCompare(b.title);
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [posts, selectedTag, selectedCategory, sortBy, sortOrder]);

  if (loading) {
    return (
      <main className="container mx-auto px-2 sm:px-4 py-8 max-w-7xl">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Johnny&apos;s Blog Posts</h1>
        <div className="text-center">Loading posts...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto px-2 sm:px-4 py-8 max-w-7xl">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Johnny&apos;s Blog Posts</h1>
        <div className="text-center text-red-500">Error: {error}</div>
        <div className="text-center mt-4">
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-2 sm:px-4 py-8 max-w-7xl">
      {/* Compact Filter Bar */}
      <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mx-2 sm:mx-0 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-2 items-center justify-between">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-1">
            <Button
              variant={selectedCategory === "" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("")}
              className="text-xs px-2 py-1"
            >
              All
            </Button>
            <Button
              variant={selectedCategory === "solana-news" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("solana-news")}
              className="text-xs px-2 py-1"
            >
              News
            </Button>
            <Button
              variant={selectedCategory === "solana-defi" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("solana-defi")}
              className="text-xs px-2 py-1"
            >
              DeFi
            </Button>
            <Button
              variant={selectedCategory === "solana-tutorials" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("solana-tutorials")}
              className="text-xs px-2 py-1"
            >
              Tutorials
            </Button>
            <Button
              variant={selectedCategory === "solana-projects" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("solana-projects")}
              className="text-xs px-2 py-1"
            >
              Projects
            </Button>
            <Button
              variant={selectedCategory === "solana-ai" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("solana-ai")}
              className="text-xs px-2 py-1"
            >
              AI
            </Button>
            <Button
              variant={selectedCategory === "solana-ecosystem" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("solana-ecosystem")}
              className="text-xs px-2 py-1"
            >
              Ecosystem
            </Button>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "date" | "title")}
              className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="date">Date</option>
              <option value="title">Title</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
              className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="desc">↓</option>
              <option value="asc">↑</option>
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedTag("");
                setSelectedCategory("");
                setSortBy("date");
                setSortOrder("desc");
              }}
              className="text-xs px-2 py-1"
            >
              Clear
            </Button>
          </div>
        </div>
        
        {/* Compact Results */}
        <div className="mt-2 text-xs text-muted-foreground text-center">
          {filteredAndSortedPosts.length} of {posts.length} posts
          {selectedCategory && ` • ${selectedCategory}`}
          {selectedTag && ` • ${selectedTag}`}
        </div>
      </div>
      
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredAndSortedPosts.map((post) => (
          <div key={post.slug} className="border rounded-lg p-4 sm:p-6 hover:shadow-lg transition-shadow max-w-full overflow-hidden">
            {post.thumbnailExists && post.coverImage && (
              <img
                  src={`/api/images/${post.coverImage}`}
                alt={post.title}
                className="w-full aspect-video object-cover rounded-lg mb-4"
              />
            )}
            
            <h2 className="text-xl font-semibold mb-2">
              <Link href={`/posts/${post.slug}`} className="hover:underline">
                {post.title}
              </Link>
            </h2>
            
            <p className="text-muted-foreground text-sm mb-2">{post.date}</p>
            
            <p className="text-foreground mb-4 line-clamp-3">{post.summary}</p>
            
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.slice(0, 3).map((tag, index) => {
                  // Handle stringified arrays
                  let displayTags: string[] = [];
                  if (typeof tag === 'string' && tag.startsWith('[') && tag.endsWith(']')) {
                    try {
                      const parsedTags = JSON.parse(tag);
                      displayTags = Array.isArray(parsedTags) ? parsedTags : [tag];
                    } catch {
                      displayTags = [tag];
                    }
                  } else {
                    displayTags = [tag];
                  }
                  
                  return displayTags.map((t, i) => (
                    <span
                      key={`${index}-${i}`}
                      className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded cursor-pointer hover:bg-muted/80"
                      onClick={() => setSelectedTag(t)}
                    >
                      {t}
                    </span>
                  ));
                })}
              </div>
            )}
            
            <div className="flex gap-2">
              <Button asChild className="flex-1">
                <Link href={`/posts/${post.slug}`}>Read More</Link>
              </Button>
              <Share text={`Check out this post: ${post.title} - ${post.summary}`} />
            </div>
          </div>
        ))}
      </div>
      
      {filteredAndSortedPosts.length === 0 && posts.length > 0 && (
        <div className="text-center text-muted-foreground py-8">
          No posts match your current filters. Try adjusting your search criteria.
        </div>
      )}
      
      {posts.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          No posts found. Make sure the backend is running on port 3006.
        </div>
      )}
    </main>
  );
}
