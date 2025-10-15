import { YouTubeScraperAdmin } from "@/components/youtube-scraper-admin";

export default function AdminPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
        <p className="text-muted-foreground">
          Manage your blog content and YouTube integration.
        </p>
      </div>
      
      <YouTubeScraperAdmin />
    </main>
  );
}
