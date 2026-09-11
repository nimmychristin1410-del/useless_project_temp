import React, { useState, useEffect } from "react";
import { sound } from "../utils/soundEngine";
import { Volume2, VolumeX, AlertTriangle, Radio, Activity, Zap, Play } from "lucide-react";

interface SoundControlBarProps {
  compact?: boolean;
}

export const SoundControlBar: React.FC<SoundControlBarProps> = ({ compact }) => {
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());
  const [volume, setVolume] = useState<number>(sound.getVolume());
  const [showSoundboard, setShowSoundboard] = useState<boolean>(false);
  const [activeTest, setActiveTest] = useState<string | null>(null);

  useEffect(() => {
    setIsMuted(sound.getMuted());
    setVolume(sound.getVolume());
  }, []);

  const handleToggleMute = () => {
    sound.unlock();
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      sound.playClick();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    sound.setVolume(val);
    if (isMuted && val > 0) {
      sound.setMuted(false);
      setIsMuted(false);
    }
  };

  const testSound = (name: string, fn: () => void) => {
    sound.unlock();
    if (isMuted) {
      sound.setMuted(false);
      setIsMuted(false);
    }
    setActiveTest(name);
    fn();
    setTimeout(() => setActiveTest(null), 1200);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 bg-[#141117] border border-[#312d38] rounded-lg px-2.5 py-1.5 text-xs text-[#948f9c]">
        <button
          id="btn-sound-mute-toggle"
          onClick={handleToggleMute}
          title={isMuted ? "Unmute sound effects" : "Mute sound effects"}
          className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${
            isMuted
              ? "text-[#ff4545] bg-[#2a1318] hover:bg-[#3d1921]"
              : "text-[#5dffa8] bg-[#12281e] hover:bg-[#18392a]"
          }`}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          <span className="font-mono text-[11px] font-semibold">{isMuted ? "MUTED" : "AUDIO ON"}</span>
        </button>

        {!compact && (
          <div className="hidden sm:flex items-center gap-2 pl-1 border-l border-[#312d38]">
            <span className="font-mono text-[10px]">VOL</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-16 h-1.5 bg-[#25202c] rounded-lg appearance-none cursor-pointer accent-[#ff5fd1]"
            />
          </div>
        )}

        <button
          id="btn-open-panic-sfx-tester"
          onClick={() => setShowSoundboard(!showSoundboard)}
          className="flex items-center gap-1 px-2 py-1 rounded bg-[#201c27] hover:bg-[#2e2738] text-[#ffd23f] border border-[#3c3447] transition-colors"
          title="Test panic and intro sound effects"
        >
          <AlertTriangle className="w-3 h-3 text-[#ffd23f]" />
          <span className="font-mono text-[10.5px]">Panic SFX {showSoundboard ? "▲" : "▼"}</span>
        </button>
      </div>

      {/* Panic Soundboard Drawer */}
      {showSoundboard && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-[#18151f] border border-[#ff5fd1]/40 rounded-xl p-3 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#312d38]">
            <span className="font-mono text-[11px] font-bold text-[#ff5fd1] flex items-center gap-1.5">
              <Radio className="w-3 h-3" /> PANIC SOUND PREVIEW
            </span>
            <span className="text-[10px] text-[#948f9c]">Web Audio Synth</span>
          </div>

          <p className="text-[10.5px] text-[#948f9c] mb-2 leading-relaxed">
            Instant procedural audio triggered during incident intro & live analysis:
          </p>

          <div className="grid grid-cols-2 gap-1.5 font-mono text-[10.5px]">
            <button
              onClick={() => testSound("klaxon", () => sound.playPanicAlarm())}
              className={`p-2 rounded border text-left flex items-center justify-between transition-colors ${
                activeTest === "klaxon"
                  ? "bg-[#ff4545]/20 border-[#ff4545] text-[#ff8a8a]"
                  : "bg-[#110e17] border-[#312d38] hover:border-[#ff4545] text-[#f3f1ea]"
              }`}
            >
              <span>🚨 Klaxon Siren</span>
              <Play className="w-2.5 h-2.5 opacity-60" />
            </button>

            <button
              onClick={() => {
                testSound("heartbeat", () => {
                  sound.startHeartbeat(140);
                  setTimeout(() => sound.stopHeartbeat(), 2400);
                });
              }}
              className={`p-2 rounded border text-left flex items-center justify-between transition-colors ${
                activeTest === "heartbeat"
                  ? "bg-[#ff5fd1]/20 border-[#ff5fd1] text-[#ffd7f4]"
                  : "bg-[#110e17] border-[#312d38] hover:border-[#ff5fd1] text-[#f3f1ea]"
              }`}
            >
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3 text-[#ff5fd1]" /> Racing Pulse
              </span>
              <Play className="w-2.5 h-2.5 opacity-60" />
            </button>

            <button
              onClick={() => testSound("riser", () => sound.startTensionRiser(2.5))}
              className={`p-2 rounded border text-left flex items-center justify-between transition-colors ${
                activeTest === "riser"
                  ? "bg-[#ffd23f]/20 border-[#ffd23f] text-[#ffe999]"
                  : "bg-[#110e17] border-[#312d38] hover:border-[#ffd23f] text-[#f3f1ea]"
              }`}
            >
              <span>📈 Tension Riser</span>
              <Play className="w-2.5 h-2.5 opacity-60" />
            </button>

            <button
              onClick={() => testSound("sonar", () => sound.playRadarPing())}
              className={`p-2 rounded border text-left flex items-center justify-between transition-colors ${
                activeTest === "sonar"
                  ? "bg-[#5dffa8]/20 border-[#5dffa8] text-[#5dffa8]"
                  : "bg-[#110e17] border-[#312d38] hover:border-[#5dffa8] text-[#f3f1ea]"
              }`}
            >
              <span>📡 Radar Ping</span>
              <Play className="w-2.5 h-2.5 opacity-60" />
            </button>

            <button
              onClick={() => testSound("toast", () => sound.playEmergencyToast())}
              className={`p-2 rounded border text-left flex items-center justify-between transition-colors ${
                activeTest === "toast"
                  ? "bg-[#ff4545]/20 border-[#ff4545] text-[#ff8a8a]"
                  : "bg-[#110e17] border-[#312d38] hover:border-[#ff4545] text-[#f3f1ea]"
              }`}
            >
              <span>⚠️ Panic Alert</span>
              <Play className="w-2.5 h-2.5 opacity-60" />
            </button>

            <button
              onClick={() => testSound("boot", () => sound.playIntroBoot())}
              className={`p-2 rounded border text-left flex items-center justify-between transition-colors ${
                activeTest === "boot"
                  ? "bg-[#9b7bff]/20 border-[#9b7bff] text-[#c9b8ff]"
                  : "bg-[#110e17] border-[#312d38] hover:border-[#9b7bff] text-[#f3f1ea]"
              }`}
            >
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-[#9b7bff]" /> BIOS Boot SFX
              </span>
              <Play className="w-2.5 h-2.5 opacity-60" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
