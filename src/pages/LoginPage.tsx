import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Shield, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("demo@resqnet.app");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields"); return; }
    setLoading(true);
    setTimeout(() => {
      const ok = login(email, password);
      if (ok) navigate("/");
      else { setError("Invalid email or password"); setLoading(false); }
    }, 400);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8 animate-in">
        {/* Logo */}
        <div className="text-center space-y-3">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto gradient-border">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">ResQNet</h1>
            <p className="text-sm text-muted-foreground mt-1">Crisis response platform</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm text-center animate-in">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="input-field"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="input-field"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
            {loading ? (
              <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <>Sign In <ArrowRight className="h-4 w-4" /></>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">Sign up</Link>
          </p>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">DEMO</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <p className="text-center text-xs text-muted-foreground">
            <code className="px-1.5 py-0.5 rounded-md bg-secondary text-foreground/70">demo@resqnet.app</code>
            {" / "}
            <code className="px-1.5 py-0.5 rounded-md bg-secondary text-foreground/70">demo123</code>
          </p>
        </div>
      </div>
    </div>
  );
}
