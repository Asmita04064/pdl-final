import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { User, Shield, Bluetooth, Radio, ChevronRight } from "lucide-react";

const nearbyPeople = [
  { id: "n1", name: "Alex", distance: "120m away", role: "Responder", method: "Bluetooth" },
  { id: "n2", name: "Sarah", distance: "300m away", role: "Responder", method: "Radio" },
  { id: "n3", name: "Mike", distance: "450m away", role: "Responder", method: "Bluetooth" },
];

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [connections, setConnections] = useState<Record<string, boolean>>({});

  if (!user) return null;

  const displayTitle = useMemo(() => {
    if (user.role === "admin") return "Verified Citizen";
    if (user.role === "responder") return "Verified Responder";
    return "Verified Citizen";
  }, [user.role]);

  const levelTag = useMemo(() => {
    if (user.role === "admin") return "Level 4 Responder";
    if (user.role === "responder") return "Level 3 Responder";
    return "Level 1 Citizen";
  }, [user.role]);

  const handleConnect = (id: string) => {
    setConnections((prev) => ({ ...prev, [id]: true }));
    navigate(`/chat?peer=${id}`);
  };

  const handleDisconnect = (id: string) => {
    setConnections((prev) => ({ ...prev, [id]: false }));
  };

  return (
    <div className="max-w-lg mx-auto p-4 pb-24 md:pb-4 space-y-5 animate-in">
      <div className="rounded-3xl bg-card border border-border p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-violet-600 text-white flex items-center justify-center text-3xl font-bold">
            {user.name
              .split(" ")
              .map((part) => part.charAt(0))
              .slice(0, 2)
              .join("")}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold tracking-tight">{user.name}</h1>
            <p className="text-sm text-muted-foreground">{displayTitle} · {levelTag}</p>
            <p className="text-sm text-muted-foreground mt-2">Monitoring safety protocols. Stay safe out there.</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-background p-4 text-center border border-border">
            <p className="text-lg font-semibold">8</p>
            <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em] mt-1">Nearby</p>
          </div>
          <div className="rounded-2xl bg-background p-4 text-center border border-border">
            <p className="text-lg font-semibold">1.2k</p>
            <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em] mt-1">Followers</p>
          </div>
          <div className="rounded-2xl bg-background p-4 text-center border border-border">
            <p className="text-lg font-semibold">450</p>
            <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em] mt-1">Following</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <p className="text-sm font-semibold">Nearby Responders</p>
            <p className="text-xs text-muted-foreground">Connect using Bluetooth or radio</p>
          </div>
          <button className="rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground hover:bg-muted transition">
            See all
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {nearbyPeople.map((person) => {
            const connected = connections[person.id];
            const isBluetooth = person.method === "Bluetooth";
            return (
              <div key={person.id} className="rounded-3xl bg-background p-4 text-center border border-border">
                <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-secondary text-2xl font-bold text-foreground">
                  {person.name.charAt(0)}
                </div>
                <p className="font-semibold">{person.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{person.distance}</p>
                <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground mt-2">{person.role}</p>
                <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-muted/70 px-2 py-1 text-[11px] font-medium text-muted-foreground">
                  {isBluetooth ? <Bluetooth className="h-3 w-3" /> : <Radio className="h-3 w-3" />}
                  {person.method}
                </div>
                <button
                  onClick={() => (connected ? handleDisconnect(person.id) : handleConnect(person.id))}
                  className={`mt-4 w-full rounded-2xl px-3 py-2 text-sm font-semibold transition ${
                    connected
                      ? "bg-emerald-500 text-white hover:bg-emerald-400"
                      : "bg-primary text-white hover:bg-primary/90"
                  }`}
                >
                  {connected ? "Connected" : "Connect"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border p-5 shadow-sm">
        <p className="text-sm font-semibold mb-3">Connection Mode</p>
        <div className="rounded-2xl bg-background border border-border p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Bluetooth className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-semibold">Bluetooth</p>
              <p className="text-xs text-muted-foreground">Secure local pairing for nearby devices.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Radio className="h-5 w-5 text-amber-500" />
            <div>
              <p className="text-sm font-semibold">Radio</p>
              <p className="text-xs text-muted-foreground">Long-range broadcast to nearby first responders.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
