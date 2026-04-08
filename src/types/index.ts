export type Severity = "low" | "medium" | "critical";
export type VerificationStatus = "Verified" | "Under Review" | "Likely Misleading";
export type DisasterCategory = "flood" | "fire" | "earthquake" | "medical" | "infrastructure" | "other";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "responder" | "admin";
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  description: string;
  category: DisasterCategory;
  severity: Severity;
  locationName: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  verificationStatus: VerificationStatus;
  confidenceScore: number;
  userId: string;
  userName: string;
  createdAt: string;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  category: DisasterCategory;
  severity: Severity;
  locationName: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  verificationStatus: VerificationStatus;
  confidenceScore: number;
  status: "pending" | "active" | "resolved";
  userId: string;
  userName: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  room: string;
  content: string;
  senderId: string;
  senderName: string;
  createdAt: string;
}

export interface AssistantMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
  createdAt: string;
}

export interface VerificationResult {
  status: VerificationStatus;
  confidence: number;
  category: DisasterCategory;
  reason: string[];
}
