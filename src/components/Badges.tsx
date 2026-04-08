import type { Severity, VerificationStatus } from "@/types";
import { CheckCircle2, Clock, AlertTriangle } from "lucide-react";

export function SeverityBadge({ severity }: { severity: Severity }) {
  const config = {
    critical: { cls: "severity-critical", label: "Critical", dot: "bg-red-400" },
    medium: { cls: "severity-medium", label: "Warning", dot: "bg-orange-400" },
    low: { cls: "severity-low", label: "Watch", dot: "bg-yellow-400" },
  };
  const { cls, label, dot } = config[severity];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  const config = {
    "Verified": { cls: "status-verified", Icon: CheckCircle2 },
    "Under Review": { cls: "status-review", Icon: Clock },
    "Likely Misleading": { cls: "status-misleading", Icon: AlertTriangle },
  };
  const { cls, Icon } = config[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-medium border ${cls}`}>
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
}

export function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-medium bg-primary/8 text-primary/80 capitalize">
      {category}
    </span>
  );
}
