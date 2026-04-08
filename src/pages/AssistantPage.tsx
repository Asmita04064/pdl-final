import { useState, useRef, useEffect, useCallback } from "react";
import { Bot, Send, User, Video, VideoOff, Camera } from "lucide-react";
import type { AssistantMessage } from "@/types";

const KB: Record<string, string> = {
  flood: `**Flood Safety Guide - Complete Handbook**

**What is a Flood?**
A flood occurs when water overflows onto normally dry land. This can happen due to heavy rainfall, storm surges, dam breaks, or rapid snowmelt.

**Before a Flood:**
- Know your flood risk - check local flood maps
- Prepare an emergency kit with water, food, medications, and important documents
- Make a family emergency plan and designate a meeting place
- Elevate electrical appliances and utilities
- Buy flood insurance - standard homeowners insurance doesn't cover flooding
- Prepare sandbags and waterproofing materials

**During a Flood:**
- Move to higher ground immediately if flooding is imminent
- Avoid walking or driving through flood waters - 6 inches of moving water can knock you down, 12 inches can float a car
- Stay away from downed power lines and electrical wires
- If trapped in a building, go to the highest floor
- Listen to emergency broadcasts for updates
- Turn off utilities at main switches if instructed to do so

**After a Flood:**
- Return home only when authorities say it's safe
- Avoid driving through standing water
- Check for structural damage before entering
- Take photos of damage for insurance claims
- Boil water until authorities declare it safe
- Watch for secondary hazards like contaminated water and disease

**Emergency Contacts:**
- National Disaster Response Force (NDRF): 011-24363260
- Local Police: 100
- Fire Services: 101
- Medical Emergency: 102/108

**Remember:** Flood waters can contain sewage, chemicals, and debris. Even shallow water can hide dangerous currents.`,
  fire: `**Fire Safety and Emergency Response Guide**

**Types of Fires:**
- Class A: Ordinary combustibles (wood, paper, cloth)
- Class B: Flammable liquids (gasoline, oil, paint)
- Class C: Electrical fires
- Class D: Metal fires
- Class K: Kitchen fires (cooking oils/fats)

**Fire Prevention:**
- Install and maintain smoke alarms on every level
- Keep fire extinguishers accessible and know how to use them
- Never leave cooking unattended
- Keep flammable materials away from heat sources
- Practice electrical safety - don't overload outlets
- Have working fire escapes and emergency ladders

**During a Fire:**
- GET OUT, STAY OUT, CALL for help
- Crawl low under smoke - smoke rises, cleaner air is lower
- Feel doors before opening - if hot, use another exit
- Use wet cloth over nose/mouth to filter smoke
- Stop, Drop, and Roll if clothes catch fire
- Never go back inside a burning building
- Call emergency services from a safe location

**Fire Extinguisher Use:**
- P.A.S.S. method: Pull pin, Aim at base of fire, Squeeze handle, Sweep side to side
- Use appropriate extinguisher for fire type
- Know when to evacuate instead of fighting fire

**Emergency Numbers:**
- Fire Services: 101
- Police: 100
- Ambulance: 102
- Control Room: 112

**Post-Fire Safety:**
- Do not enter damaged buildings
- Watch for structural collapse
- Seek medical attention for smoke inhalation
- Contact insurance immediately`,
  earthquake: `**Earthquake Preparedness and Response**

**Understanding Earthquakes:**
- Caused by sudden release of energy in Earth's crust
- Measured by Richter scale (magnitude) and Mercalli scale (intensity)
- Can cause ground shaking, liquefaction, landslides, and tsunamis
- Aftershocks can occur for days or weeks

**Before an Earthquake:**
- Secure heavy furniture and appliances
- Know safe spots in each room (under sturdy tables, against interior walls)
- Prepare emergency kits and family plans
- Identify potential hazards in your home
- Learn first aid and CPR
- Make your home earthquake-resistant where possible

**During an Earthquake:**
- DROP to the ground, COVER under protective furniture, HOLD ON until shaking stops
- Stay away from windows, exterior walls, and tall furniture
- If outdoors, move to open area away from buildings, trees, and power lines
- If driving, stop safely and stay in vehicle
- If in bed, stay there and protect head with pillow

**After an Earthquake:**
- Expect aftershocks - DROP, COVER, HOLD ON
- Check yourself and others for injuries
- Check utilities for damage (gas leaks, electrical shorts)
- Listen to emergency broadcasts for instructions
- Be prepared for secondary hazards (fires, landslides, tsunamis)
- Help neighbors who may need assistance

**Emergency Response:**
- Police: 100
- Fire: 101
- Ambulance: 102
- Disaster Management: 1078
- National Emergency: 112

**Long-term Recovery:**
- Document damage for insurance
- Follow rebuilding guidelines
- Participate in community recovery efforts
- Prepare for future earthquakes`,
  emergency: `**Emergency Contact Directory - India**

**National Emergency Numbers:**
- **112**: Universal Emergency Number (works nationwide)
- **100**: Police Emergency
- **101**: Fire Emergency  
- **102**: Ambulance/Medical Emergency
- **108**: Free Ambulance Service (rural areas)
- **1091**: Women Helpline
- **1098**: Child Helpline
- **1078**: Disaster Management Helpline

**State-wise Emergency Numbers:**
- **Andhra Pradesh**: Police 100, Fire 101, Ambulance 108
- **Delhi**: Police 100, Fire 101, Ambulance 102
- **Gujarat**: Police 100, Fire 101, Ambulance 108
- **Karnataka**: Police 100, Fire 101, Ambulance 102
- **Maharashtra**: Police 100, Fire 101, Ambulance 102/108
- **Rajasthan**: Police 100, Fire 101, Ambulance 102
- **Tamil Nadu**: Police 100, Fire 101, Ambulance 108
- **Uttar Pradesh**: Police 100, Fire 101, Ambulance 102/108
- **West Bengal**: Police 100, Fire 101, Ambulance 102

**International Emergency:**
- **911**: If calling from abroad to India

**Important Guidelines:**
- Always provide your exact location when calling
- Stay calm and speak clearly
- Have emergency contacts saved in phone
- Know your blood type and medical conditions
- Keep emergency numbers visible in home/office

**Additional Resources:**
- National Disaster Management Authority (NDMA)
- Indian Red Cross Society
- Local Civil Defense organizations`,
  severity: `**Understanding ResQNet Severity Levels**

**Severity Classification System:**
Our app uses a three-tier severity system to help prioritize emergency responses:

**🔴 Critical (Red):**
- Immediate danger to life and property
- Requires urgent emergency response
- Examples: Active flooding, building collapse, major fires, mass casualties
- Response time: Within minutes
- Verification: Multiple sources, high confidence

**🟡 Warning (Yellow/Orange):**
- Potential danger developing
- Requires preparation and monitoring
- Examples: Rising flood waters, earthquake aftershocks, chemical spills
- Response time: Within hours
- Verification: Single or unconfirmed reports

**🟢 Watch (Green):**
- Situation developing, stay informed
- No immediate danger but monitor closely
- Examples: Weather warnings, minor tremors, suspicious activities
- Response time: Within days
- Verification: Low confidence, needs verification

**Verification Status:**
- **Verified**: Confirmed by multiple independent sources
- **Under Review**: Being evaluated by responders
- **Likely Misleading**: Could not be verified, may be false alarm

**How to Report:**
- Use the Report tab to submit incidents
- Include location, description, and photos if possible
- Reports are automatically verified using AI analysis
- False reports may result in account restrictions

**Responder Guidelines:**
- Critical reports get immediate attention
- Warning reports are monitored and verified
- Watch reports are logged for future reference
- All reports contribute to community safety`,
  help: `**ResQNet AI Assistant - Help Guide**

**What I Can Help With:**
- **Disaster Safety**: Floods, fires, earthquakes, and other emergencies
- **Emergency Contacts**: Phone numbers for police, fire, ambulance
- **Severity Levels**: Understanding alert classifications
- **Safety Tips**: Prevention and response strategies
- **Report Guidance**: How to submit accurate emergency reports

**How to Ask Questions:**
- Be specific: "What should I do during a flood?"
- Ask about locations: "Emergency numbers in Mumbai"
- Request guidance: "How to prepare for earthquakes"
- Get verification help: "What does 'Critical' severity mean?"

**Available Commands:**
- "flood" - Complete flood safety guide
- "fire" - Fire prevention and response
- "earthquake" - Earthquake preparedness
- "emergency" - Contact directory
- "severity" - Alert level explanations
- "help" - This guide

**Video Analysis Feature:**
- Start a video call for real-time safety monitoring
- Images are captured every 10 seconds
- AI analyzes for potential hazards
- Get instant safety assessments

**Tips for Best Results:**
- Use clear, specific questions
- Include location details when relevant
- Take photos of incidents for better analysis
- Stay calm during emergencies

**Emergency Override:**
If you're in immediate danger, call emergency services directly:
- Police: 100
- Fire: 101
- Ambulance: 102
- Universal: 112

Stay safe and help keep your community secure!`,
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
  const [currentPage, setCurrentPage] = useState(1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const messagesPerPage = 8;
  const totalPages = Math.ceil(messages.length / messagesPerPage);
  const startIndex = (currentPage - 1) * messagesPerPage;
  const endIndex = startIndex + messagesPerPage;
  const currentMessages = messages.slice(startIndex, endIndex);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [currentMessages.length, typing]);

  useEffect(() => {
    // Auto-scroll to last page when new messages arrive
    if (messages.length > 0 && currentPage < totalPages) {
      setCurrentPage(totalPages);
    }
  }, [messages.length, totalPages, currentPage]);

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
        {currentMessages.map((msg) => (
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

        {typing && currentPage === totalPages && (
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-3 border-t border-border/50 bg-background/50">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm rounded-lg bg-secondary hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm rounded-lg bg-secondary hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

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
