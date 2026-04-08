import { useDataStore } from "@/store/dataStore";
import { SeverityBadge, VerificationBadge, CategoryBadge } from "@/components/Badges";
import { MapPin, Clock, User, ChevronRight } from "lucide-react";

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

export default function FeedPage() {
  const posts = useDataStore((s) => s.posts);

  return (
    <div className="max-w-xl mx-auto pb-24 md:pb-4">
      {/* Stories-style header */}
      <div className="px-4 py-5 border-b border-border/50">
        <h1 className="text-lg font-bold tracking-tight">Crisis Feed</h1>
        <p className="text-xs text-muted-foreground mt-0.5">{posts.length} active reports</p>
      </div>

      {/* Posts */}
      <div className="divide-y divide-border/50">
        {posts.map((post, i) => (
          <article
            key={post.id}
            className="px-4 py-4 hover:bg-card/50 transition-colors duration-200 animate-in"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            {/* Header row */}
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold truncate">{post.userName}</span>
                  <span className="text-xs text-muted-foreground">· {timeAgo(post.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{post.locationName}</span>
                </div>
              </div>
              <SeverityBadge severity={post.severity} />
            </div>

            {/* Content */}
            <div className="pl-12">
              <h2 className="font-semibold text-[15px] leading-snug mb-1.5">{post.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">{post.description}</p>

              {/* Image */}
              {post.imageUrl && (
                <div className="mb-3 rounded-lg overflow-hidden border border-border/50">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-auto max-h-96 object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-1.5">
                <CategoryBadge category={post.category} />
                <VerificationBadge status={post.verificationStatus} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
