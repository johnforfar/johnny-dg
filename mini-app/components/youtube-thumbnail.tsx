import Image from "next/image";
import Link from "next/link";

interface YouTubeThumbnailProps {
  src: string;
  alt: string;
  href: string;
  className?: string;
}

export function YouTubeThumbnail({ src, alt, href, className = "" }: YouTubeThumbnailProps) {
  return (
    <Link href={href} className={`relative block group ${className}`}>
      <div className="relative overflow-hidden rounded-lg">
        <Image
          src={src}
          alt={alt}
          width={400}
          height={225}
          className="w-full aspect-video object-cover transition-transform group-hover:scale-105"
        />
        
        {/* YouTube icon overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300">
          <div className="bg-red-600 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-75 group-hover:scale-100">
            <svg 
              className="w-6 h-6 text-white" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>
        </div>
        
        {/* YouTube badge */}
        <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          <span>YouTube</span>
        </div>
      </div>
    </Link>
  );
}
