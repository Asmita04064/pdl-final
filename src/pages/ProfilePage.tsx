import { useAuthStore } from "@/store/authStore";
import { useDataStore } from "@/store/dataStore";
import { User, Shield, Calendar, FileText, Mail, ChevronRight, Settings } from "lucide-react";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const reports = useDataStore((s) => s.reports);
  const posts = useDataStore((s) => s.posts);

  if (!user) return null;

  const userReports = reports.filter((r) => r.userId === user.id).length;
  const userPosts = posts.filter((p) => p.userId === user.id).length;

  return (
    <div className="max-w-lg mx-auto p-4 pb-24 md:pb-4 space-y-5 animate-in">
      {/* Profile header */}
      <div className="flex items-center gap-4 pt-4">
        <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
          <User className="h-9 w-9 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold tracking-tight">{user.name}</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <span className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-medium bg-primary/10 text-primary capitalize">
            <Shield className="h-3 w-3" /> {user.role}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden">
        <div className="bg-card p-4 text-center">
          <p className="text-xl font-bold">{userReports}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Reports</p>
        </div>
        <div className="bg-card p-4 text-center">
          <p className="text-xl font-bold">{userPosts}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Posts</p>
        </div>
        <div className="bg-card p-4 text-center">
          <p className="text-xl font-bold">{Math.floor((Date.now() - new Date(user.createdAt).getTime()) / 86400000)}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Days</p>
        </div>
      </div>

      {/* Info section */}
      <div className="space-y-1">
        <p className="section-title px-1 mb-2">Account</p>
        <div className="rounded-2xl bg-card border border-border overflow-hidden divide-y divide-border">
          <div className="flex items-center gap-3 px-4 py-3.5">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm flex-1">{user.email}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
          </div>
          <div className="flex items-center gap-3 px-4 py-3.5">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm flex-1">Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
          </div>
          <div className="flex items-center gap-3 px-4 py-3.5">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm flex-1">Settings</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
          </div>
        </div>
      </div>
    </div>
  );
}
