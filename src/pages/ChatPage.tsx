import { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDataStore } from "@/store/dataStore";
import { useAuthStore } from "@/store/authStore";
import { Send, Hash, ArrowLeft, Video, VideoOff, Phone } from "lucide-react";

const ROOMS = [
  { id: "emergency", name: "Emergency" },
  { id: "mumbai", name: "Mumbai" },
  { id: "delhi", name: "Delhi NCR" },
  { id: "bangalore", name: "Bangalore" },
];

const DIRECT_PEERS = [
  { id: "n1", name: "Alex" },
  { id: "n2", name: "Sarah" },
  { id: "n3", name: "Mike" },
];

export default function ChatPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeRoom, setActiveRoom] = useState("emergency");
  const [input, setInput] = useState("");
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const messages = useDataStore((s) => s.messages);
  const addMessage = useDataStore((s) => s.addMessage);
  const user = useAuthStore((s) => s.user);
  const bottomRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const peerId = searchParams.get("peer");
  const isDirectChat = !!peerId;
  const currentRoom = isDirectChat ? `peer-${peerId}` : activeRoom;
  const roomMessages = messages.filter((m) => m.room === currentRoom);
  const peerName = DIRECT_PEERS.find(p => p.id === peerId)?.name || "Responder";

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [roomMessages.length]);

  // Cleanup video stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startVideoCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: true
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsVideoCallActive(true);
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
    setIsVideoCallActive(false);
  };

  const handleSend = () => {
    if (!input.trim() || !user) return;
    addMessage({ room: currentRoom, content: input.trim(), senderId: user.id, senderName: user.name });
    setInput("");
  };

  const handleBackToChannels = () => {
    navigate("/chat");
  };

  return (
    <div className="flex h-[calc(100vh-57px)]">
      {/* Sidebar */}
      <aside className={`w-52 flex-col border-r border-border/50 ${isDirectChat ? 'hidden' : 'hidden md:flex'}`}>
        <div className="p-4">
          <p className="section-title">Channels</p>
        </div>
        <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
          {ROOMS.map((room) => (
            <button
              key={room.id}
              onClick={() => setActiveRoom(room.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                activeRoom === room.id
                  ? "bg-secondary text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <span className="truncate">{room.name}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile tabs */}
        <div className={`flex items-center gap-1 p-2 overflow-x-auto border-b border-border/50 ${isDirectChat ? 'hidden' : 'md:hidden'}`}>
          {ROOMS.map((room) => (
            <button
              key={room.id}
              onClick={() => setActiveRoom(room.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                activeRoom === room.id
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {room.name}
            </button>
          ))}
        </div>

        {/* Header */}
        <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isDirectChat && (
              <button
                onClick={handleBackToChannels}
                className="p-1 rounded-lg hover:bg-secondary transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <h3 className="text-sm font-semibold flex items-center gap-1.5">
              {isDirectChat ? (
                <>
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {peerName}
                </>
              ) : (
                <>
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  {ROOMS.find((r) => r.id === activeRoom)?.name}
                </>
              )}
            </h3>
          </div>
          {isDirectChat && (
            <button
              onClick={isVideoCallActive ? stopVideoCall : startVideoCall}
              className={`p-2 rounded-lg transition-colors ${
                isVideoCallActive
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              {isVideoCallActive ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
            </button>
          )}
        </div>

        {/* Video Call Section */}
        {isDirectChat && isVideoCallActive && (
          <div className="p-4 border-b border-border/50 bg-card/50">
            <div className="relative max-w-md mx-auto">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-48 bg-black rounded-lg object-cover"
              />
              <div className="absolute top-2 right-2">
                <button
                  onClick={stopVideoCall}
                  className="p-2 bg-destructive/80 text-destructive-foreground rounded-full hover:bg-destructive transition-colors"
                  title="End Video Call"
                >
                  <VideoOff className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground text-center">
              Video call active with {peerName}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {roomMessages.length === 0 && (
            <p className="text-center text-muted-foreground text-sm pt-12">No messages yet</p>
          )}
          {roomMessages.map((msg) => {
            const isMe = msg.senderId === user?.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"} animate-in`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                  isMe
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-secondary rounded-bl-md"
                }`}>
                  {!isMe && <p className="text-xs font-semibold text-primary mb-0.5">{msg.senderName}</p>}
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <p className={`text-[10px] mt-1 ${isMe ? "text-primary-foreground/50" : "text-muted-foreground"}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-border/50">
          <div className="flex gap-2 items-center">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Message..."
              className="input-field !rounded-full !py-2.5"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 active:scale-95 transition-all disabled:opacity-30"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
