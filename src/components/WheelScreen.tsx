import React, { useState } from "react";
import { sound } from "../utils/soundEngine";
import { Compass, RotateCw, RefreshCw, CheckCircle2 } from "lucide-react";

interface WheelScreenProps {
  options: string[];
  onRestart: () => void;
}

const DEFAULT_OPTIONS = [
  "Drink a large glass of cold water",
  "Put your phone in another room for 45 mins",
  "Go outside and look at a single cloud",
  "Take 3 deep 4-7-8 box breaths",
  "Text an unrelated friend a bizarre meme",
  "Stare at the ceiling until your brain reboots"
];

const SLICE_COLORS = [
  "#ff5fd1",
  "#ffd23f",
  "#5dffa8",
  "#9b7bff",
  "#ff4545",
  "#efe6c8"
];

export const WheelScreen: React.FC<WheelScreenProps> = ({ options, onRestart }) => {
  const wheelItems = options && options.length >= 4 ? options.slice(0, 6) : DEFAULT_OPTIONS;
  const [rotation, setRotation] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [selectedSolution, setSelectedSolution] = useState<string | null>(null);

  const handleSpin = () => {
    if (isSpinning) return;
    sound.unlock();
    setIsSpinning(true);
    setSelectedSolution(null);

    // Audio click ratchet timer
    let clickCount = 0;
    const maxClicks = 28;
    const clickInterval = setInterval(() => {
      sound.playWheelSpinClick();
      clickCount++;
      if (clickCount >= maxClicks) {
        clearInterval(clickInterval);
      }
    }, 120);

    const sliceAngle = 360 / wheelItems.length;
    const extraTurns = 360 * 5;
    const randomAngle = Math.floor(Math.random() * 360);
    const targetRotation = rotation + extraTurns + randomAngle;
    setRotation(targetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      sound.playWheelWin();

      // Calculate which segment the pointer is pointing to
      const actualDeg = (360 - (targetRotation % 360)) % 360;
      const index = Math.floor(actualDeg / sliceAngle) % wheelItems.length;
      setSelectedSolution(wheelItems[index]);
    }, 3600);
  };

  const sliceAngle = 360 / wheelItems.length;
  const gradientStops = wheelItems
    .map((_, idx) => `${SLICE_COLORS[idx % SLICE_COLORS.length]} ${idx * sliceAngle}deg ${(idx + 1) * sliceAngle}deg`)
    .join(", ");

  return (
    <div className="w-full max-w-xl mx-auto py-4 px-3 sm:px-4 flex flex-col items-center text-center animate-in fade-in duration-300">
      <div className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#5dffa8] tracking-widest border border-[#5dffa8]/40 rounded-full px-3 py-1 mb-2 bg-[#5dffa8]/10">
        <Compass className="w-3 h-3" /> STEP 4 OF 4 — RESOLUTION PROTOCOL
      </div>

      <h2 className="font-['Unbounded',sans-serif] font-bold text-2xl sm:text-3xl text-[#f3f1ea] mb-1">
        THE WHEEL OF USELESS SOLUTIONS
      </h2>
      <p className="font-mono text-xs text-[#948f9c] mb-6">
        Scientifically unproven. Emotionally satisfying. Let fate decide your coping mechanism.
      </p>

      {/* Wheel Zone */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-4 flex items-center justify-center">
        {/* Top Pointer Needle */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-x-8 border-x-transparent border-t-[18px] border-t-[#ffd23f] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />

        {/* Rotating Wheel Disc */}
        <div
          className="w-full h-full rounded-full border-4 border-[#1c1a20] relative overflow-hidden shadow-[0_0_0_4px_#0a0a0c,0_10px_35px_rgba(0,0,0,0.7)]"
          style={{
            background: `conic-gradient(${gradientStops})`,
            transform: `rotate(${rotation}deg)`,
            transition: "transform 3.6s cubic-bezier(0.17, 0.86, 0.32, 1.02)"
          }}
        >
          {wheelItems.map((item, idx) => (
            <div
              key={idx}
              className="absolute left-1/2 top-1/2 w-[48%] origin-[0%_50%] font-mono text-[9px] sm:text-[10px] font-extrabold text-[#0a0a0c] text-right pr-3 leading-tight select-none pointer-events-none line-clamp-2"
              style={{
                transform: `rotate(${idx * sliceAngle + sliceAngle / 2}deg)`
              }}
            >
              {item}
            </div>
          ))}
        </div>

        {/* Center Hub */}
        <div className="absolute w-14 h-14 rounded-full bg-[#0a0a0c] border-2 border-[#ffd23f] flex items-center justify-center text-xl z-10 shadow-lg select-none">
          🌀
        </div>
      </div>

      {/* Result Card */}
      <div
        className={`w-full max-w-md min-h-[72px] border border-dashed rounded-xl p-3.5 my-4 flex items-center justify-center transition-all ${
          selectedSolution
            ? "border-[#ff5fd1] bg-[#ff5fd1]/10 text-[#f3f1ea] shadow-xl"
            : "border-[#312d38] text-[#6b6575]"
        }`}
      >
        {selectedSolution ? (
          <div className="font-mono text-xs sm:text-sm font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#5dffa8] flex-shrink-0" />
            <span>🎯 YOUR OFFICIAL ACTION: {selectedSolution}</span>
          </div>
        ) : (
          <div className="font-mono text-xs italic">
            Spin the wheel above to reveal your tailored coping directive...
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
        <button
          id="btn-spin-wheel"
          onClick={handleSpin}
          disabled={isSpinning}
          className="px-8 py-3.5 rounded-xl font-mono font-bold text-xs sm:text-sm bg-[#5dffa8] hover:bg-[#72ffb4] text-[#0a0a0c] shadow-[0_5px_0_#2b8a5c] active:translate-y-1 active:shadow-[0_2px_0_#2b8a5c] disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
        >
          <RotateCw className={`w-4 h-4 ${isSpinning ? "animate-spin" : ""}`} />
          <span>{isSpinning ? "CALCULATING FATE..." : "SPIN THE WHEEL"}</span>
        </button>

        <button
          id="btn-restart-app"
          onClick={() => {
            sound.playClick();
            onRestart();
          }}
          className="px-5 py-3.5 rounded-xl font-mono text-xs text-[#948f9c] hover:text-[#f3f1ea] border border-[#312d38] hover:bg-[#1a1720] transition-colors flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>I'M HEALED (NEW INCIDENT)</span>
        </button>
      </div>
    </div>
  );
};
