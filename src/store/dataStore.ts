import { create } from "zustand";
import type { Post, Report, ChatMessage } from "@/types";

const SEED_POSTS: Post[] = [
  { id: "p1", title: "Flash Flood Warning - Riverside Colony", description: "Water levels rising rapidly near the riverbank. Multiple streets flooded. Residents urged to evacuate to higher ground immediately.", category: "flood", severity: "critical", locationName: "Riverside Colony, Mumbai", latitude: 19.076, longitude: 72.8777, verificationStatus: "Verified", confidenceScore: 0.92, userId: "u1", userName: "Arjun Mehta", createdAt: "2025-04-07T08:30:00Z", imageUrl: "/1.png", imageCaption: "Image shows flooded streets with water rising rapidly near the riverbank in Riverside Colony." },
  { id: "p2", title: "Building Fire - Industrial Area", description: "Fire broke out in a warehouse at sector 12. Fire brigade has been alerted. No casualties reported so far.", category: "fire", severity: "medium", locationName: "Sector 12, Noida", latitude: 28.5355, longitude: 77.391, verificationStatus: "Verified", confidenceScore: 0.88, userId: "u2", userName: "Priya Sharma", createdAt: "2025-04-07T07:15:00Z", imageUrl: "/2.png", imageCaption: "Image shows fire breaking out in a warehouse in the industrial area." },
  { id: "p3", title: "Minor Tremors Felt in Southern District", description: "Residents reported feeling mild tremors around 6 AM. No structural damage observed yet. Authorities monitoring the situation.", category: "earthquake", severity: "low", locationName: "Koramangala, Bangalore", latitude: 12.9352, longitude: 77.6245, verificationStatus: "Under Review", confidenceScore: 0.65, userId: "u3", userName: "Demo User", createdAt: "2025-04-07T06:00:00Z", imageUrl: "/3.png", imageCaption: "Image shows minor structural damage from tremors in the southern district." },
  { id: "p4", title: "Road Collapse Near Highway", description: "A section of the road has caved in near the highway junction. Traffic diverted. Municipal teams dispatched.", category: "infrastructure", severity: "medium", locationName: "NH-48 Junction, Gurgaon", latitude: 28.4595, longitude: 77.0266, verificationStatus: "Verified", confidenceScore: 0.85, userId: "u1", userName: "Arjun Mehta", createdAt: "2025-04-06T22:00:00Z", imageUrl: "/4.png", imageCaption: "Image shows collapsed road section near the highway junction." },
  { id: "p5", title: "Suspicious Gas Leak Report", description: "Strong chemical smell reported by multiple residents. Could be a gas leak from nearby factory. Unconfirmed.", category: "other", severity: "medium", locationName: "Andheri East, Mumbai", latitude: 19.1197, longitude: 72.8464, verificationStatus: "Likely Misleading", confidenceScore: 0.35, userId: "u3", userName: "Demo User", createdAt: "2025-04-06T18:45:00Z", imageUrl: "/5.png", imageCaption: "Image shows suspicious gas leak with chemical smell in residential area." },
  { id: "p6", title: "Medical Emergency - Mass Food Poisoning", description: "Over 30 people admitted to district hospital after consuming contaminated water. Health department investigating.", category: "medical", severity: "critical", locationName: "Civil Hospital, Ahmedabad", latitude: 23.0225, longitude: 72.5714, verificationStatus: "Verified", confidenceScore: 0.91, userId: "u2", userName: "Priya Sharma", createdAt: "2025-04-06T14:30:00Z", imageCaption: "Image shows mass food poisoning emergency at the district hospital." },
  // Additional reports at same locations to demonstrate clustering
  { id: "p7", title: "Flood Update - Riverside Colony", description: "Water levels still rising. More streets affected. Emergency evacuation in progress.", category: "flood", severity: "critical", locationName: "Riverside Colony, Mumbai", latitude: 19.0761, longitude: 72.8778, verificationStatus: "Verified", confidenceScore: 0.89, userId: "u4", userName: "Rahul Kumar", createdAt: "2025-04-07T09:00:00Z", imageCaption: "Image shows ongoing flood with rising water levels affecting more streets." },
  { id: "p8", title: "Fire Spread Alert - Industrial Area", description: "Fire has spread to adjacent buildings. More fire trucks dispatched.", category: "fire", severity: "critical", locationName: "Sector 12, Noida", latitude: 28.5356, longitude: 77.3911, verificationStatus: "Verified", confidenceScore: 0.95, userId: "u5", userName: "Sneha Patel", createdAt: "2025-04-07T07:30:00Z", imageCaption: "Image shows fire spreading to adjacent buildings in the industrial area." },
];

const SEED_REPORTS: Report[] = SEED_POSTS.map((p, i) => ({
  ...p,
  id: `r${i + 1}`,
  status: i < 2 ? "active" : i < 4 ? "pending" : "resolved",
}));

const SEED_MESSAGES: ChatMessage[] = [
  { id: "m1", room: "emergency", content: "Is everyone safe in Riverside Colony area?", senderId: "u1", senderName: "Arjun Mehta", createdAt: "2025-04-07T08:35:00Z" },
  { id: "m2", room: "emergency", content: "We evacuated to the school building. Need water supplies.", senderId: "u3", senderName: "Demo User", createdAt: "2025-04-07T08:37:00Z" },
  { id: "m3", room: "emergency", content: "Relief team dispatched to your location. ETA 20 minutes.", senderId: "u2", senderName: "Priya Sharma", createdAt: "2025-04-07T08:40:00Z" },
  { id: "m4", room: "mumbai", content: "Any update on the Andheri gas leak situation?", senderId: "u3", senderName: "Demo User", createdAt: "2025-04-07T09:00:00Z" },
  { id: "m5", room: "mumbai", content: "Authorities confirmed it was a false alarm. Area is safe.", senderId: "u1", senderName: "Arjun Mehta", createdAt: "2025-04-07T09:05:00Z" },
];

interface DataState {
  posts: Post[];
  reports: Report[];
  messages: ChatMessage[];
  addPost: (post: Omit<Post, "id" | "createdAt" | "verificationStatus" | "confidenceScore">) => Post;
  addReport: (report: Omit<Report, "id" | "createdAt" | "verificationStatus" | "confidenceScore" | "status">) => Report;
  addMessage: (msg: Omit<ChatMessage, "id" | "createdAt">) => void;
}

function verify(text: string, category: string): { status: Post["verificationStatus"]; confidence: number; } {
  const urgentWords = ["flood", "fire", "earthquake", "collapse", "emergency", "evacuate", "casualties", "hospital"];
  const matches = urgentWords.filter((w) => text.toLowerCase().includes(w));
  const confidence = Math.min(0.5 + matches.length * 0.12, 0.95);
  if (confidence > 0.8) return { status: "Verified", confidence };
  if (confidence > 0.55) return { status: "Under Review", confidence };
  return { status: "Likely Misleading", confidence };
}

export const useDataStore = create<DataState>((set, get) => ({
  posts: SEED_POSTS,
  reports: SEED_REPORTS,
  messages: SEED_MESSAGES,
  addPost: (post) => {
    const v = verify(post.title + " " + post.description, post.category);
    const newPost: Post = { ...post, id: `p${Date.now()}`, createdAt: new Date().toISOString(), verificationStatus: v.status, confidenceScore: v.confidence };
    set((s) => ({ posts: [newPost, ...s.posts] }));
    return newPost;
  },
  addReport: (report) => {
    const v = verify(report.title + " " + report.description, report.category);
    const newReport: Report = { ...report, id: `r${Date.now()}`, createdAt: new Date().toISOString(), verificationStatus: v.status, confidenceScore: v.confidence, status: "pending" };
    set((s) => ({ reports: [newReport, ...s.reports] }));
    return newReport;
  },
  addMessage: (msg) => {
    const newMsg: ChatMessage = { ...msg, id: `m${Date.now()}`, createdAt: new Date().toISOString() };
    set((s) => ({ messages: [...s.messages, newMsg] }));
  },
}));
