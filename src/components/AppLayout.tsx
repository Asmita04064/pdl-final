import { Link, useLocation } from "react-router-dom";
import { Home, AlertTriangle, Map, MessageCircle, Bot, User, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const NAV_ITEMS = [
  { path: "/", label: "Feed", icon: Home },
  { path: "/report", label: "Report", icon: AlertTriangle },
  { path: "/map", label: "Map", icon: Map },
  { path: "/chat", label: "Chat", icon: MessageCircle },
  { path: "/assistant", label: "AI", icon: Bot },
  { path: "/profile", label: "Profile", icon: User },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const { user, logout, isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="text-base font-bold tracking-tight">
              ResQNet
            </span>
          </Link>

          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-0.5">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                      active
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                    {active && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-primary" />
                    )}
                  </Link>
                );
              })}
            </nav>
          )}

          {isAuthenticated && (
            <button
              onClick={logout}
              className="btn-ghost text-sm !px-3 !py-2 text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Mobile bottom nav — Instagram style */}
      {isAuthenticated && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-t border-border/50">
          <div className="flex justify-around items-center h-14">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center justify-center w-14 h-full transition-all duration-200 ${
                    active ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <Icon className={`h-[22px] w-[22px] ${active ? "stroke-[2.5]" : "stroke-[1.5]"}`} />
                  {active && (
                    <span className="w-1 h-1 rounded-full bg-primary mt-1" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
