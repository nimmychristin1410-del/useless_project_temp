import React, { useEffect, useState } from "react";
import { sound } from "../utils/soundEngine";
import { Terminal, ShieldAlert, Flame } from "lucide-react";

interface WelcomeScreenProps {
  onStart: () => void;
}

const BOOT_LINES = [
  "> initializing paranoia_engine.sys ...",
  "> loading assumptions about what they meant by that ...",
  "> retrieving screenshots you definitely archived ...",
  "> calculating odds you're overreacting: 94.2%",
  "> calculating odds you're right anyway: also 94.2%",
  "> panic audio synthesizer: primed & armed.",
  "> incident interpretation protocols: READY."
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
  const [currentCharIndex, setCurrentCharIndex] = useState<number>(0);
  const [isBootComplete, setIsBootComplete] = useState<boolean>(false);

  useEffect(() => {
    // Trigger boot sound on initial load if context permits
    sound.playIntroBoot();
  }, []);

  useEffect(() => {
    if (currentLineIndex >= BOOT_LINES.length) {
      setIsBootComplete(true);
      return;
    }

    const targetLine = BOOT_LINES[currentLineIndex];

    if (currentCharIndex < targetLine.length) {
      const charTimer = setTimeout(() => {
        // Every 3 characters play a soft mechanical keystroke sound
        if (currentCharIndex % 4 === 0) {
          sound.playKeyClick();
        }
        setTypedLines((prev) => {
          const next = [...prev];
          next[currentLineIndex] = targetLine.slice(0, currentCharIndex + 1);
          return next;
        });
        setCurrentCharIndex((c) => c + 1);
      }, 14);
      return () => clearTimeout(charTimer);
    } else {
      const lineTimer = setTimeout(() => {
        setCurrentLineIndex((l) => l + 1);
        setCurrentCharIndex(0);
      }, 180);
      return () => clearTimeout(lineTimer);
    }
  }, [currentLineIndex, currentCharIndex]);

  const handleStart = () => {
    sound.unlock();
    sound.playClick();
    onStart();
  };

  return (
    <div className="flex flex-col items-center text-center max-w-2xl mx-auto py-6 px-4 animate-in fade-in duration-300">
      <div className="inline-flex items-center gap-2 font-mono text-[11px] text-[#ff5fd1] tracking-widest border border-[#ff5fd1]/60 rounded-full px-3 py-1 mb-5 bg-[#ff5fd1]/10">
        <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
        SYSTEM STATUS: EMOTIONALLY COMPROMISED
      </div>

      <div className="relative mb-4 group cursor-default">
        <h1
          className="font-['Unbounded',sans-serif] font-black text-3xl sm:text-5xl lg:text-6xl text-[#f3f1ea] tracking-tight leading-tight select-none"
          data-text="WELCOME OVERTHINKER!"
        >
          WELCOME OVERTHINKER!
        </h1>
        <div className="text-[11px] font-mono text-[#5dffa8] tracking-widest mt-1 flex items-center justify-center gap-1">
          <Terminal className="w-3.5 h-3.5" />
          INCIDENT PARANOIA OS v4.2 // WITH PROCEDURAL PANIC AUDIO
        </div>
      </div>

      <p className="text-sm sm:text-base text-[#948f9c] leading-relaxed max-w-lg mb-6 font-mono">
        You clicked one link and now we know everything. Sit down. Let's turn your one (1) small incident into a fully staged forensic investigation with sound effects.
      </p>

      {/* Terminal Boot Window */}
      <div className="w-full max-w-md bg-[#0d0d10] border border-[#312d38] rounded-xl p-4 text-left font-mono text-xs text-[#5dffa8] shadow-2xl mb-8 min-h-[160px] relative overflow-hidden">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#221f28] text-[10px] text-[#948f9c]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ff4545] inline-block"></span>
            <span className="w-2 h-2 rounded-full bg-[#ffd23f] inline-block"></span>
            <span className="w-2 h-2 rounded-full bg-[#5dffa8] inline-block"></span>
            <span>boot_sequence.log</span>
          </span>
          <span className="text-[#ffd23f]">{isBootComplete ? "SYS_OK" : "INITIALIZING..."}</span>
        </div>

        <div className="space-y-1">
          {typedLines.map((line, idx) => (
            <div key={idx} className="leading-snug text-[#5dffa8]/90">
              {line}
              {idx === currentLineIndex && !isBootComplete && (
                <span className="inline-block w-2 h-3.5 bg-[#5dffa8] ml-1 animate-pulse align-middle" />
              )}
            </div>
          ))}
        </div>
      </div>

      {isBootComplete ? (
        <button
          id="btn-start-spiraling"
          onClick={handleStart}
          className="group relative inline-flex items-center gap-2 font-mono font-bold text-sm bg-[#ff5fd1] hover:bg-[#ff7be0] text-[#0a0a0c] px-8 py-4 rounded-xl shadow-[0_6px_0_#a13488] active:translate-y-1 active:shadow-[0_2px_0_#a13488] transition-all cursor-pointer animate-in zoom-in-95 duration-200"
        >
          <Flame className="w-4 h-4 text-[#0a0a0c] group-hover:rotate-12 transition-transform" />
          <span>CUSTOMIZE INCIDENT & SPIRAL →</span>
        </button>
      ) : (
        <button
          id="btn-skip-boot"
          onClick={() => {
            sound.playKeyClick();
            setTypedLines(BOOT_LINES);
            setIsBootComplete(true);
          }}
          className="text-xs font-mono text-[#948f9c] hover:text-[#f3f1ea] underline cursor-pointer"
        >
          [Skip Boot Sequence]
        </button>
      )}
    </div>
  );
};
