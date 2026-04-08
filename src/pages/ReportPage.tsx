import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDataStore } from "@/store/dataStore";
import { useAuthStore } from "@/store/authStore";
import type { DisasterCategory, Severity } from "@/types";
import { AlertTriangle, MapPin, Send, CheckCircle2 } from "lucide-react";

const CATEGORIES: DisasterCategory[] = ["flood", "fire", "earthquake", "medical", "infrastructure", "other"];
const SEVERITIES: Severity[] = ["low", "medium", "critical"];

export default function ReportPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const addReport = useDataStore((s) => s.addReport);
  const addPost = useDataStore((s) => s.addPost);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<DisasterCategory>("flood");
  const [severity, setSeverity] = useState<Severity>("medium");
  const [locationName, setLocationName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [locationMode, setLocationMode] = useState<"auto" | "manual">("auto");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser");
      return;
    }
    setError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(String(pos.coords.latitude));
        setLongitude(String(pos.coords.longitude));
        setLocationMode("auto");
      },
      () => setError("Could not get location. Please enter coordinates manually.")
    );
  };

  const handleLocationModeChange = (mode: "auto" | "manual") => {
    setLocationMode(mode);
    if (mode === "manual") {
      setLatitude("");
      setLongitude("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!title || !description || !locationName) {
      setError("Title, description, and location name are required");
      return;
    }
    if (locationMode === "manual" && (!latitude || !longitude)) {
      setError("Latitude and longitude are required for manual location");
      return;
    }
    if (locationMode === "auto" && (!latitude || !longitude)) {
      setError("Please get your current location first");
      return;
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (isNaN(lat) || isNaN(lng)) {
      setError("Invalid coordinates");
      return;
    }

    const data = { title, description, category, severity, locationName, latitude: lat, longitude: lng, userId: user!.id, userName: user!.name };
    addReport(data);
    addPost(data);
    setSuccess(true);
    setTimeout(() => navigate("/"), 1500);
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto p-4 pt-20 text-center space-y-4 animate-in">
        <div className="h-16 w-16 rounded-2xl bg-verified/10 flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-8 w-8 text-verified" />
        </div>
        <h2 className="text-xl font-bold">Report Submitted</h2>
        <p className="text-muted-foreground text-sm">Your report is being verified by our system.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-4 pb-24 md:pb-4 space-y-5 animate-in">
      <div className="pt-2">
        <h1 className="text-lg font-bold tracking-tight">New Report</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Submit an incident report</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm text-center animate-in">{error}</div>}

        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Incident title" className="input-field" />

        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Describe the situation..." className="input-field resize-none" />

        <div className="grid grid-cols-2 gap-3">
          <select value={category} onChange={(e) => setCategory(e.target.value as DisasterCategory)} className="input-field appearance-none capitalize">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={severity} onChange={(e) => setSeverity(e.target.value as Severity)} className="input-field appearance-none capitalize">
            {SEVERITIES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <input value={locationName} onChange={(e) => setLocationName(e.target.value)} placeholder="Location name" className="input-field" />

        {/* Location Mode Selection */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleLocationModeChange("auto")}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                locationMode === "auto"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              Auto Location
            </button>
            <button
              type="button"
              onClick={() => handleLocationModeChange("manual")}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                locationMode === "manual"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              Manual Coordinates
            </button>
          </div>

          {locationMode === "auto" ? (
            <button type="button" onClick={useCurrentLocation} className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors">
              <MapPin className="h-4 w-4" /> Get Current Location
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <input
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="Latitude (e.g., 19.0760)"
                className="input-field"
                type="number"
                step="any"
              />
              <input
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="Longitude (e.g., 72.8777)"
                className="input-field"
                type="number"
                step="any"
              />
            </div>
          )}

          {(latitude || longitude) && (
            <div className="text-xs text-muted-foreground bg-secondary/50 p-2 rounded-lg">
              Coordinates: {latitude || "0"}, {longitude || "0"}
            </div>
          )}
        </div>

        <button type="submit" className="btn-primary">
          <Send className="h-4 w-4" /> Submit Report
        </button>
      </form>
    </div>
  );
}
