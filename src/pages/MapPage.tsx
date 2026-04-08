import { useState, useMemo, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useDataStore } from "@/store/dataStore";
import { SeverityBadge, VerificationBadge, CategoryBadge } from "@/components/Badges";
import type { DisasterCategory, Severity } from "@/types";

function markerColor(severity: Severity, locationReports: number) {
  // If multiple users report same location, make it critical (red)
  if (locationReports > 1) return "#ef4444"; // Red for multiple reports
  return severity === "critical" ? "#ef4444" : "#eab308"; // Red for critical, Yellow for others
}

function getMarkerLabel(severity: Severity, locationReports: number) {
  return "";
}

const FILTERS: (DisasterCategory | "all")[] = ["all", "flood", "fire", "earthquake", "medical", "infrastructure", "other"];

export default function MapPage() {
  const reports = useDataStore((s) => s.reports);
  const [filter, setFilter] = useState<DisasterCategory | "all">("all");
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  const filtered = useMemo(
    () => (filter === "all" ? reports : reports.filter((r) => r.category === filter)),
    [reports, filter]
  );

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: [20.5937, 78.9629],
      zoom: 5,
      zoomControl: true,
    });
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://carto.com">CARTO</a>',
    }).addTo(map);
    markersRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when filtered data changes
  useEffect(() => {
    if (!markersRef.current) return;
    markersRef.current.clearLayers();

    // Group reports by location (rounded to 4 decimal places for proximity)
    const locationGroups: { [key: string]: typeof filtered } = {};
    filtered.forEach((r) => {
      const key = `${r.latitude.toFixed(4)},${r.longitude.toFixed(4)}`;
      if (!locationGroups[key]) locationGroups[key] = [];
      locationGroups[key].push(r);
    });

    // Create markers for each location group
    Object.entries(locationGroups).forEach(([locationKey, reportsAtLocation]) => {
      const firstReport = reportsAtLocation[0];
      const locationReports = reportsAtLocation.length;
      const highestSeverity = reportsAtLocation.reduce((max, r) =>
        r.severity === "critical" ? "critical" : max === "critical" ? "critical" : r.severity
      , "low" as Severity);

      const color = markerColor(highestSeverity, locationReports);
      const icon = L.divIcon({
        className: "",
        html: `<div style="width:32px;height:32px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([firstReport.latitude, firstReport.longitude], { icon });

      // Create popup showing all reports at this location
      const popupContent = reportsAtLocation.map(r => `
        <div style="margin-bottom:8px; padding-bottom:8px; border-bottom:1px solid #eee;">
          <h3 style="font-weight:bold;font-size:14px;margin:0 0 4px;">${r.title}</h3>
          <p style="font-size:12px;color:#888;margin:0 0 4px;">${r.category} · ${r.severity} · ${r.verificationStatus}</p>
          <p style="font-size:12px;color:#666;margin:0 0 4px;">${r.description.substring(0, 100)}...</p>
          <p style="font-size:11px;color:#999;margin:0;">${r.locationName}</p>
        </div>
      `).join('');

      marker.bindPopup(`
        <div style="min-width:250px;max-height:300px;overflow-y:auto;">
          <h3 style="font-weight:bold;margin-bottom:8px;">${locationReports} report${locationReports > 1 ? 's' : ''} at this location</h3>
          ${popupContent}
        </div>
      `);
      markersRef.current!.addLayer(marker);
    });
  }, [filtered]);

  return (
    <div className="flex flex-col h-[calc(100vh-60px)]">
      {/* Filter bar */}
      <div className="flex items-center gap-2 p-3 overflow-x-auto border-b border-border/50">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize whitespace-nowrap transition-colors ${filter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <div ref={containerRef} className="h-full w-full" style={{ background: "hsl(222 47% 6%)" }} />
        <div className="absolute bottom-4 left-4 glass-card p-3 text-xs space-y-1 z-[1000]">
          <div className="flex items-center gap-2"><span className="inline-block w-2 h-2 rounded-full bg-red-500" /> Critical / Multiple Reports</div>
          <div className="flex items-center gap-2"><span className="inline-block w-2 h-2 rounded-full bg-yellow-500" /> Normal</div>
        </div>
      </div>
    </div>
  );
}
