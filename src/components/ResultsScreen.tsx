import React, { useEffect, useRef, useState } from "react";
import { IncidentAnalysisResult, IncidentFormData } from "../types";
import { sound } from "../utils/soundEngine";
import { FileText, Copy, Check, RotateCcw, Compass, ShieldAlert, Sparkles } from "lucide-react";

interface ResultsScreenProps {
  result: IncidentAnalysisResult;
  formData: IncidentFormData;
  onSpinWheel: () => void;
  onRestart: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  result,
  formData,
  onSpinWheel,
  onRestart
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Draw customized Brain Allocation Donut Chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const data = result.brainAllocation;
    const total = data.reduce((sum, item) => sum + item.percentage, 0);

    let startAngle = -Math.PI / 2;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const outerRadius = 68;
    const innerRadius = 38;

    data.forEach((slice) => {
      const sliceAngle = (slice.percentage / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, startAngle, startAngle + sliceAngle);
      ctx.arc(centerX, centerY, innerRadius, startAngle + sliceAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = slice.color;
      ctx.fill();
      startAngle += sliceAngle;
    });

    // Center icon/label
    ctx.fillStyle = "#f3f1ea";
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("BRAIN", centerX, centerY - 6);
    ctx.fillStyle = "#ff5fd1";
    ctx.font = "9px monospace";
    ctx.fillText("100% USED", centerX, centerY + 8);
  }, [result]);

  const handleCopy = () => {
    sound.playClick();
    const text = `🧠 CASE FILE: ${result.incidentTitle}\nCase #: ${result.caseNumber}\nOverthinking Score: ${result.panicScore}%\n\nExecutive Diagnosis:\n${result.executiveDiagnosis}\n\nPrescription:\n${result.certifiedPrescription}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-4 px-3 sm:px-4 animate-in fade-in duration-300">
      {/* Case Header Banner */}
      <div className="bg-[#151318] border border-[#312d38] rounded-xl p-4 sm:p-5 mb-5 shadow-2xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#25212c] pb-3 mb-3">
          <div>
            <div className="font-mono text-[10px] text-[#ff5fd1] tracking-widest uppercase">
              CONFIDENTIAL PSYCHIATRIC DOSSIER
            </div>
            <h2 className="font-['Unbounded',sans-serif] font-bold text-lg sm:text-2xl text-[#f3f1ea]">
              {result.incidentTitle}
            </h2>
          </div>
          <div className="text-right">
            <span className="font-mono text-xs text-[#948f9c] block">CASE ID</span>
            <span className="font-mono font-bold text-sm text-[#ffd23f]">{result.caseNumber}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#ff4545]/20 text-[#ff8a8a] border border-[#ff4545]/40 font-semibold">
            {result.severityLabel}
          </span>
          <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#9b7bff]/20 text-[#c9b8ff] border border-[#9b7bff]/40">
            ACTOR: {formData.actor || "Subject of Paranoia"}
          </span>
          <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#5dffa8]/20 text-[#5dffa8] border border-[#5dffa8]/40">
            TIME: {formData.timeElapsed || "Recently"}
          </span>
        </div>

        <p className="font-mono text-xs sm:text-sm text-[#d0cad9] leading-relaxed bg-[#0d0d10] p-3 rounded-lg border border-[#2a2533]">
          {result.executiveDiagnosis}
        </p>
      </div>

      {/* Grid: Donut Chart & Capacity Meter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {/* Brain Resource Allocation */}
        <div className="bg-[#151318] border border-[#312d38] rounded-xl p-4">
          <h3 className="font-mono font-bold text-xs text-[#f3f1ea] mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#ff5fd1]" />
            BRAIN RESOURCE ALLOCATION
          </h3>
          <div className="flex items-center gap-4">
            <canvas ref={canvasRef} width={150} height={150} className="flex-shrink-0" />
            <div className="flex flex-col gap-2 font-mono text-[11px] flex-1">
              {result.brainAllocation.map((slice, idx) => (
                <div key={idx} className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: slice.color }} />
                    <span className="text-[#948f9c] truncate">{slice.label}</span>
                  </div>
                  <span className="text-[#f3f1ea] font-bold">{slice.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="font-mono text-[10px] text-[#6e6878] mt-3 italic text-center">
            Percentages are emotionally accurate, not mathematically constrained.
          </div>
        </div>

        {/* Capacity Report */}
        <div className="bg-[#151318] border border-[#312d38] rounded-xl p-4 flex flex-col justify-between">
          <div>
            <h3 className="font-mono font-bold text-xs text-[#f3f1ea] mb-3 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-[#ffd23f]" />
              CAPACITY REPORT
            </h3>

            {/* Things you can control */}
            <div className="mb-4">
              <div className="flex justify-between font-mono text-xs mb-1">
                <span className="text-[#948f9c]">Things you can actually control</span>
                <span className="text-[#5dffa8] font-bold">12%</span>
              </div>
              <div className="w-full h-2 bg-[#0d0d10] rounded-full overflow-hidden border border-[#312d38]">
                <div className="h-full bg-[#5dffa8] rounded-full" style={{ width: "12%" }} />
              </div>
            </div>

            {/* Overthinking Level */}
            <div>
              <div className="flex justify-between font-mono text-xs mb-1">
                <span className="text-[#948f9c]">Overthinking level</span>
                <span className="text-[#ff4545] font-bold">{result.panicScore}%</span>
              </div>
              <div className="w-full h-3 bg-[#0d0d10] rounded-full overflow-hidden border border-[#ff4545]/40 p-0.5">
                <div className="h-full bg-[repeating-linear-gradient(135deg,#ff4545,#ff4545_6px,#ff8a8a_6px,#ff8a8a_12px)] rounded-full animate-pulse" style={{ width: "100%" }} />
              </div>
              <div className="font-mono text-[10px] text-[#ff4545] mt-1.5">
                ⚠️ ERROR: VALUE EXCEEDS KNOWN BIOLOGICAL SCALE. RECALIBRATION IMPOSSIBLE.
              </div>
            </div>
          </div>

          <div className="bg-[#100d14] border border-[#2c2636] p-2.5 rounded-lg mt-3 font-mono text-[11px] text-[#c9c3d6]">
            <strong>Primary Heuristic:</strong> You are currently interpreting silence as hostility and ambiguity as a targeted insult.
          </div>
        </div>
      </div>

      {/* Forensic Translation Matrix */}
      <div className="bg-[#151318] border border-[#312d38] rounded-xl p-4 sm:p-5 mb-5">
        <h3 className="font-mono font-bold text-xs text-[#f3f1ea] mb-3 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-[#5dffa8]" />
          FORENSIC TRANSLATION: WHAT HAPPENED VS WHAT YOUR BRAIN HEARD
        </h3>

        <div className="space-y-3 font-mono">
          {result.translationMatrix.map((row, idx) => (
            <div key={idx} className="bg-[#0d0d10] border border-[#2b2633] rounded-lg p-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                <div>
                  <span className="text-[10px] text-[#5dffa8] uppercase font-bold tracking-wider block mb-1">
                    [LITERAL REALITY]
                  </span>
                  <div className="text-xs text-[#c9c3d6]">{row.actualEvent}</div>
                </div>
                <div>
                  <span className="text-[10px] text-[#ff4545] uppercase font-bold tracking-wider block mb-1">
                    [OVERTHINKING TRANSLATION]
                  </span>
                  <div className="text-xs text-[#ffd7f4] font-medium">{row.brainInterpretation}</div>
                </div>
              </div>
              <div className="text-right border-t border-[#1f1b26] pt-1.5">
                <span className="text-[10px] text-[#ffd23f] bg-[#ffd23f]/10 px-2 py-0.5 rounded border border-[#ffd23f]/30">
                  {row.dangerRating}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* The 3 Timelines */}
      <div className="bg-[#151318] border border-[#312d38] rounded-xl p-4 sm:p-5 mb-5">
        <h3 className="font-mono font-bold text-xs text-[#f3f1ea] mb-3 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-[#9b7bff]" />
          THE THREE DIVERGENT TIMELINES
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          {/* Reality */}
          <div className="bg-[#0d1410] border border-[#5dffa8]/40 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-[#5dffa8] uppercase">REALITY</span>
              <span className="text-[10px] bg-[#5dffa8]/20 text-[#5dffa8] px-1.5 py-0.5 rounded">
                {result.threeTimelines.reality.probability}
              </span>
            </div>
            <div className="font-bold text-[#f3f1ea] text-xs mb-1">{result.threeTimelines.reality.title}</div>
            <p className="text-[11px] text-[#a9d9be] leading-relaxed">{result.threeTimelines.reality.description}</p>
          </div>

          {/* Mild Friction */}
          <div className="bg-[#17140d] border border-[#ffd23f]/40 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-[#ffd23f] uppercase">MILD AWKWARD</span>
              <span className="text-[10px] bg-[#ffd23f]/20 text-[#ffd23f] px-1.5 py-0.5 rounded">
                {result.threeTimelines.paranoid.probability}
              </span>
            </div>
            <div className="font-bold text-[#f3f1ea] text-xs mb-1">{result.threeTimelines.paranoid.title}</div>
            <p className="text-[11px] text-[#e0cf9b] leading-relaxed">{result.threeTimelines.paranoid.description}</p>
          </div>

          {/* Nuclear Doom */}
          <div className="bg-[#1a0c10] border border-[#ff4545]/40 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-[#ff4545] uppercase">YOUR BRAIN NOW</span>
              <span className="text-[10px] bg-[#ff4545]/20 text-[#ff4545] px-1.5 py-0.5 rounded">
                {result.threeTimelines.apocalyptic.probability}
              </span>
            </div>
            <div className="font-bold text-[#f3f1ea] text-xs mb-1">{result.threeTimelines.apocalyptic.title}</div>
            <p className="text-[11px] text-[#f2aab4] leading-relaxed">{result.threeTimelines.apocalyptic.description}</p>
          </div>
        </div>
      </div>

      {/* Certified Psychiatric Prescription Memo */}
      <div className="relative bg-[#efe6c8] text-[#332c14] rounded-lg p-5 sm:p-6 mb-6 shadow-2xl -rotate-1 border border-[#d8cca3]">
        <div className="font-mono text-xs font-bold text-[#635528] uppercase tracking-wider mb-2">
          🩺 OFFICIAL CLINICAL RECOMMENDATION
        </div>
        <p className="font-mono text-xs sm:text-sm leading-relaxed mb-4 text-[#201c0f]">
          {result.certifiedPrescription}
        </p>

        {/* Certified Rubber Stamp */}
        <div className="absolute right-4 bottom-3 border-2 border-[#ff4545] text-[#ff4545] font-['Unbounded',sans-serif] font-black text-xs px-2.5 py-1 rounded -rotate-12 opacity-90 select-none">
          CERTIFIED ✔
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onRestart}
            className="px-4 py-3 rounded-xl border border-[#312d38] font-mono text-xs text-[#948f9c] hover:text-[#f3f1ea] hover:bg-[#1a1720] transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Tweak Incident
          </button>
          <button
            onClick={handleCopy}
            className="px-4 py-3 rounded-xl border border-[#312d38] font-mono text-xs text-[#ffd23f] hover:bg-[#1a1720] transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#5dffa8]" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied to Clipboard!" : "Copy Dossier"}
          </button>
        </div>

        <button
          id="btn-spin-wheel-step"
          onClick={() => {
            sound.unlock();
            sound.playClick();
            onSpinWheel();
          }}
          className="py-3.5 px-6 rounded-xl font-mono font-bold text-xs sm:text-sm bg-[#ff5fd1] hover:bg-[#ff7be0] text-[#0a0a0c] shadow-[0_5px_0_#a13488] active:translate-y-1 active:shadow-[0_2px_0_#a13488] transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>SPIN FOR A USELESS SOLUTION →</span>
        </button>
      </div>
    </div>
  );
};
