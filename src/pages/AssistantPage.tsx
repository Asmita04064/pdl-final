import { useState, useRef, useEffect, useCallback } from "react";
import { Bot, Send, User, Video, VideoOff, Camera } from "lucide-react";
import type { AssistantMessage } from "@/types";

const KB: Record<string, string> = {
  flood: "**During a flood:**\n- Move to higher ground immediately\n- Avoid walking/driving through flood waters\n- 6 inches of moving water can knock you down\n- Turn off utilities at main switches\n- Disconnect electrical appliances\n- Do not touch electrical equipment if wet\n\n**Emergency numbers:** Call 112 (India) or your local emergency number.",
  fire: "**During a fire:**\n- GET OUT, STAY OUT, CALL for help\n- Crawl low under smoke\n- Feel doors before opening — if hot, use another exit\n- Cover nose/mouth with a wet cloth\n- Stop, Drop, and Roll if clothes catch fire\n- Never go back inside a burning building\n\n**Emergency:** Call 101 (Fire) or 112.",
  earthquake: "**During an earthquake:**\n- DROP, COVER, and HOLD ON\n- Stay away from windows and heavy objects\n- If indoors, stay inside — do not run outside\n- If outdoors, move away from buildings\n- After shaking stops, check for injuries\n- Be prepared for aftershocks\n\n**Emergency:** Call 112.",
  emergency: "**Emergency contacts (India):**\n- Police: 100\n- Fire: 101\n- Ambulance: 102 / 108\n- Disaster Management: 1078\n- Women Helpline: 1091\n- Universal Emergency: 112",
  severity: "**Severity levels in ResQNet:**\n- Watch (Low): Situation developing, stay informed\n- Warning (Medium): Potential danger, prepare to act\n- Critical: Immediate danger, take action now\n\nVerification statuses:\n- Verified: Confirmed by multiple sources\n- Under Review: Being evaluated\n- Likely Misleading: Could not be verified",
  help: "I can help with:\n- **Flood safety** — ask about floods\n- **Fire safety** — ask about fire\n- **Earthquake safety** — ask about earthquakes\n- **Emergency contacts** — ask for emergency numbers\n- **Severity levels** — ask what severity levels mean",
};

function getResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes("flood") || q.includes("water")) return KB.flood;
  if (q.includes("fire") || q.includes("burn")) return KB.fire;
  if (q.includes("earthquake") || q.includes("tremor") || q.includes("quake")) return KB.earthquake;
  if (q.includes("emergency") || q.includes("contact") || q.includes("number") || q.includes("call")) return KB.emergency;
  if (q.includes("severity") || q.includes("red") || q.includes("yellow") || q.includes("badge") || q.includes("verified")) return KB.severity;
  if (q.includes("help") || q.includes("what can") || q.includes("hi") || q.includes("hello")) return KB.help;
  return "I can provide guidance on **floods, fires, earthquakes, emergency contacts**, and **severity levels**.\n\nTry asking: *\"What should I do during a flood?\"*";
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<AssistantMessage[]>([
    { id: "a0", role: "assistant", content: "Hi! I'm the **ResQNet Assistant**.\n\nI can help with disaster safety guidance and emergency contacts. What do you need?", createdAt: new Date().toISOString() },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages.length, typing]);

  // Cleanup video stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startVideoCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsVideoCallActive(true);

      // Start capturing images every 10 seconds
      intervalRef.current = setInterval(captureAndAnalyzeImage, 10000);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const stopVideoCall = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsVideoCallActive(false);
    setCapturedImages([]);
  };

  const captureAndAnalyzeImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImages(prev => [...prev.slice(-4), imageDataUrl]); // Keep last 5 images

    // Analyze the image and get AI response
    analyzeImage(imageDataUrl);
  }, []);

  const analyzeImage = (imageDataUrl: string) => {
    // Simulate AI analysis - in a real app, this would call an AI service
    const analyses = [
      "I can see you're in a safe environment. No immediate hazards detected.",
      "The area appears clear of any visible dangers. Stay alert for any changes.",
      "Everything looks normal from what I can observe. Continue monitoring your surroundings.",
      "I notice the lighting conditions are good. No signs of emergency situations.",
      "The environment appears stable. Keep following safety protocols."
    ];

    const randomAnalysis = analyses[Math.floor(Math.random() * analyses.length)];

    const imageMessage: AssistantMessage = {
      id: `img-${Date.now()}`,
      role: "user",
      content: "Image captured for analysis",
      imageUrl: imageDataUrl,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, imageMessage]);
    setTyping(true);

    setTimeout(() => {
      const analysisMessage: AssistantMessage = {
        id: `analysis-${Date.now()}`,
        role: "assistant",
        content: `Visual Analysis: ${randomAnalysis}\n\nBased on the image, I recommend staying vigilant and following standard safety procedures.`,
        createdAt: new Date().toISOString()
      };
      setMessages(prev => [...prev, analysisMessage]);
      setTyping(false);
    }, 1500);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: AssistantMessage = { id: `a${Date.now()}`, role: "user", content: input.trim(), createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const response = getResponse(userMsg.content);
      const botMsg: AssistantMessage = { id: `a${Date.now() + 1}`, role: "assistant", content: response, createdAt: new Date().toISOString() };
      setMessages((prev) => [...prev, botMsg]);
      setTyping(false);
    }, 600);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-57px)] max-w-xl mx-auto">
      {/* Video Call Section */}
      {isVideoCallActive && (
        <div className="p-4 border-b border-border/50 bg-card/50">
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-48 bg-black rounded-lg object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={captureAndAnalyzeImage}
                className="p-2 bg-primary/80 text-primary-foreground rounded-full hover:bg-primary transition-colors"
                title="Capture Image"
              >
                <Camera className="h-4 w-4" />
              </button>
              <button
                onClick={stopVideoCall}
                className="p-2 bg-destructive/80 text-destructive-foreground rounded-full hover:bg-destructive transition-colors"
                title="End Video Call"
              >
                <VideoOff className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Video call active - images are captured every 10 seconds for AI analysis
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in`}>
            {msg.role === "assistant" && (
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="h-4 w-4 text-primary" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === "user"
                ? "bg-primary text-primary-foreground rounded-br-md"
                : "bg-secondary rounded-bl-md"
            }`}>
              {msg.imageUrl && (
                <div className="mb-2">
                  <img
                    src={msg.imageUrl}
                    alt="Captured image"
                    className="w-full max-w-xs h-auto rounded-lg border border-border/50"
                  />
                </div>
              )}
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex gap-2.5 animate-in">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border/50 space-y-3">
        <div className="flex gap-2 items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about disaster safety..."
            className="input-field !rounded-full !py-2.5"
          />
          <button
            onClick={isVideoCallActive ? stopVideoCall : startVideoCall}
            className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${
              isVideoCallActive
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : "bg-primary text-primary-foreground hover:opacity-90"
            } active:scale-95`}
            title={isVideoCallActive ? "End Video Call" : "Start Video Call"}
          >
            {isVideoCallActive ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
          </button>
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 active:scale-95 transition-all disabled:opacity-30"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {["Flood safety", "Fire safety", "Emergency contacts", "Severity levels"].map((q) => (
            <button
              key={q}
              onClick={() => setInput(q)}
              className="px-3 py-1.5 rounded-full text-xs bg-secondary text-muted-foreground hover:text-foreground whitespace-nowrap transition-all"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
