import React, { useEffect, useState, useRef } from "react";
import { IncidentFormData, IncidentAnalysisResult } from "../types";
import { PANIC_TOAST_MESSAGES } from "../data/incidentData";
import { sound } from "../utils/soundEngine";
import { Radio, AlertTriangle, ShieldAlert, HeartPulse } from "lucide-react";

interface AnalyzingScreenProps {
  formData: IncidentFormData;
  selectedSymptoms: string[];
  onAnalysisComplete: (result: IncidentAnalysisResult) => void;
}

interface ToastItem {
  id: number;
  text: string;
}

export const AnalyzingScreen: React.FC<AnalyzingScreenProps> = ({
  formData,
  selectedSymptoms,
  onAnalysisComplete
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [currentLabel, setCurrentLabel] = useState<string>("Initializing threat matrix...");
  const [bubbles, setBubbles] = useState<{ id: number; text: string; left: number }[]>([]);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [isRedAlert, setIsRedAlert] = useState<boolean>(false);
  const [moodResult, setMoodResult] = useState<string | null>(null);
  const analysisResultRef = useRef<IncidentAnalysisResult | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Thought bubbles crafted around the user's incident
  const thoughtLines = [
    `Analyzing phrase: "${formData.incidentText.slice(0, 32)}..."`,
    `Evaluating reaction time (${formData.timeElapsed}) against historical norm...`,
    `Auditing emotional inflection of ${formData.actor}...`,
    "Searching for hidden subtext in whitespace and commas...",
    "Consulting 4 group chats and a crystal ball...",
    "Running 10,000 Monte Carlo social disaster simulations...",
    "Drafting unsent rebuttal text: version #14...",
    "Weighing likelihood of complete social excommunication...",
    "Scanning memory banks for similar catastrophes since 2016...",
    "Calculating dignity depletion rate per second..."
  ];

  // Fetch or compute incident analysis in the background
  useEffect(() => {
    let isCancelled = false;

    async function fetchAnalysis() {
      try {
        const response = await fetch("/api/analyze-incident", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            incidentText: formData.incidentText,
            category: formData.category,
            timeElapsed: formData.timeElapsed,
            actor: formData.actor,
            initialPanic: formData.initialPanic,
            symptoms: selectedSymptoms
          })
        });

        if (response.ok) {
          const json = await response.json();
          if (!isCancelled && json?.data) {
            analysisResultRef.current = json.data;
          }
        }
      } catch (err) {
        console.warn("Analysis request fallback:", err);
      }
    }

    fetchAnalysis();

    return () => {
      isCancelled = true;
    };
  }, [formData, selectedSymptoms]);

  // Sound and progress escalation engine
  useEffect(() => {
    sound.unlock();
    sound.startHeartbeat(75);
    sound.startTensionRiser(7);

    let currentPct = 0;
    let toastCounter = 0;

    // Pulse bubble generator
    const bubbleInterval = setInterval(() => {
      const randomLine = thoughtLines[Math.floor(Math.random() * thoughtLines.length)];
      const id = Date.now() + Math.random();
      const left = 5 + Math.random() * 65;

      setBubbles((prev) => [...prev.slice(-4), { id, text: randomLine, left }]);
      sound.playKeyClick();
    }, 700);

    // EKG Animation on Canvas
    const canvas = canvasRef.current;
    let animFrame: number;
    let ekgOffset = 0;

    if (canvas) {
      const ctx = canvas.getContext("2d");
      const drawEkg = () => {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#5dffa8";
        ctx.lineWidth = 2;
        ctx.beginPath();

        const w = canvas.width;
        const h = canvas.height;
        const mid = h / 2;

        for (let x = 0; x < w; x++) {
          const t = (x + ekgOffset) % 80;
          let y = mid;
          if (t > 30 && t < 38) {
            y = mid - 18 * Math.sin(((t - 30) / 8) * Math.PI);
          } else if (t >= 38 && t < 46) {
            y = mid + 24 * Math.sin(((t - 38) / 8) * Math.PI);
          } else if (t >= 46 && t < 54) {
            y = mid - 8 * Math.sin(((t - 46) / 8) * Math.PI);
          }
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        ekgOffset += 3 + (currentPct / 100) * 8;
        animFrame = requestAnimationFrame(drawEkg);
      };
      drawEkg();
    }

    // Progress timer with panic audio triggers
    const progressTimer = setInterval(() => {
      if (currentPct < 100) {
        currentPct += Math.floor(Math.random() * 8 + 4);
        if (currentPct > 100) currentPct = 100;
        setProgress(currentPct);

        // Ramp up heart rate from 75 to 180 BPM
        const rampedBpm = Math.floor(75 + (currentPct / 100) * 105);
        sound.setHeartbeatBPM(rampedBpm);

        // Sonar ping at milestones
        if (currentPct % 25 < 10) {
          sound.playRadarPing();
        }

        // Trigger random emergency panic alerts and sirens
        if (currentPct > 35 && currentPct < 85 && Math.random() > 0.45) {
          const toastMsg = PANIC_TOAST_MESSAGES[toastCounter % PANIC_TOAST_MESSAGES.length];
          toastCounter++;
          setToasts((prev) => [...prev.slice(-2), { id: Date.now(), text: toastMsg }]);

          sound.playEmergencyToast();
          if (Math.random() > 0.5) {
            sound.playPanicAlarm();
          }

          setIsRedAlert(true);
          setTimeout(() => setIsRedAlert(false), 500);
        }

        if (currentPct < 30) {
          setCurrentLabel("Cross-referencing punctuation and tone...");
        } else if (currentPct < 60) {
          setCurrentLabel("Simulating 40 catastrophic alternate timelines...");
        } else if (currentPct < 90) {
          setCurrentLabel("Synthesizing psychiatric damage assessment...");
        } else {
          setCurrentLabel("Dossier compiled. Generating final diagnosis...");
        }
      } else {
        clearInterval(progressTimer);
        clearInterval(bubbleInterval);
        sound.stopHeartbeat();
        sound.stopTensionRiser();
        sound.playDramaticslam();

        const detectedMoods = [
          "MOOD DETECTED: Quietly catastrophizing in 4K resolution 😭",
          "MOOD DETECTED: Courtroom trial inside head, reality losing ⚖️",
          "MOOD DETECTED: Rehearsing speeches no one requested 🎤",
          "MOOD DETECTED: Normal amount of concern (240%) 📉",
          "MOOD DETECTED: Emotionally compromised over a single punctuation mark 💥"
        ];
        const randomMood = detectedMoods[Math.floor(Math.random() * detectedMoods.length)];
        setMoodResult(randomMood);

        setTimeout(() => {
          if (analysisResultRef.current) {
            onAnalysisComplete(analysisResultRef.current);
          } else {
            // Fallback object if async response wasn't completed yet
            onAnalysisComplete({
              incidentTitle: "CASE #9284: THE AMBIGUOUS CRISIS",
              caseNumber: "OT-849102",
              severityLabel: "DEFCON 1: CATASTROPHIC SPIRAL",
              panicScore: 212,
              executiveDiagnosis: `Subject has converted a minor interpersonal event with ${formData.actor} into an existential crisis. Rational thought capacity: 6.2%.`,
              translationMatrix: [
                {
                  actualEvent: `"${formData.incidentText.slice(0, 45)}..."`,
                  brainInterpretation: `"${formData.actor} has determined that my social presence is toxic and is preparing a press release."`,
                  dangerRating: "99% Imagined Lethality"
                }
              ],
              threeTimelines: {
                reality: {
                  title: "Timeline 1: The Extremely Boring Reality",
                  probability: "93.8%",
                  description: `${formData.actor} literally put their phone down to grab a drink. They have zero recollection of the perceived slight.`
                },
                paranoid: {
                  title: "Timeline 2: Mild Social Friction",
                  probability: "6.1%",
                  description: "They saw the message, got momentarily distracted, and will reply in 4 hours."
                },
                apocalyptic: {
                  title: "Timeline 3: Total Nuclear Excommunication",
                  probability: "0.1%",
                  description: "They are currently testifying before Congress about your unforgivable behavior."
                }
              },
              brainAllocation: [
                { label: "Punctuation & Tone Deconstruction", percentage: 44, color: "#ff5fd1" },
                { label: "Drafting Imaginary Arguments", percentage: 26, color: "#ffd23f" },
                { label: "Checking Online Timestamps", percentage: 22, color: "#9b7bff" },
                { label: "Actual Objective Facts", percentage: 8, color: "#5dffa8" }
              ],
              microAudit: [
                {
                  clue: `Interaction with ${formData.actor}`,
                  overthinkingObsession: "Assumes coldness means perpetual hatred.",
                  rationalVerdict: "They were busy typing with wet hands while cooking pasta."
                }
              ],
              certifiedPrescription: "Put down the phone. Drink a glass of cold water. Lie on the floor for 5 minutes.",
              recommendedWheelOptions: [
                "Drink a cold glass of water",
                "Put your phone in another room",
                "Take 3 deep box breaths",
                "Text a random friend a funny meme",
                "Do 15 quick jumping jacks",
                "Stare at the ceiling until your brain resets"
              ],
              humorousNotes: [
                "Reminder: Your brain is currently a screenplay writer with unlimited budget.",
                "Actual odds of this mattering in 48 hours: 0.001%."
              ]
            });
          }
        }, 1600);
      }
    }, 280);

    return () => {
      clearInterval(progressTimer);
      clearInterval(bubbleInterval);
      if (animFrame) cancelAnimationFrame(animFrame);
      sound.stopHeartbeat();
      sound.stopTensionRiser();
    };
  }, [formData, onAnalysisComplete]);

  return (
    <div
      className={`relative w-full max-w-2xl mx-auto py-6 px-4 flex flex-col items-center text-center transition-all ${
        isRedAlert ? "scale-[0.99] bg-[#220a10]/40" : ""
      }`}
    >
      {/* Emergency Red Vignette overlay */}
      {isRedAlert && (
        <div className="fixed inset-0 pointer-events-none z-50 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(255,40,40,0.35)_100%)] animate-pulse" />
      )}

      {/* Floating Panic Toasts */}
      <div className="fixed top-14 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-xs">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="bg-[#1c0d12] border border-[#ff4545] text-[#ffb3b3] font-mono text-xs px-3 py-2 rounded-lg shadow-2xl animate-in slide-in-from-right-4 duration-200"
          >
            {toast.text}
          </div>
        ))}
      </div>

      <div className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#ff4545] tracking-widest border border-[#ff4545]/60 rounded-full px-3 py-1 mb-3 bg-[#ff4545]/10 animate-pulse">
        <ShieldAlert className="w-3.5 h-3.5" />
        STEP 3 OF 4 — LIVE FORENSIC DECONSTRUCTION
      </div>

      <h2 className="font-['Unbounded',sans-serif] font-bold text-2xl sm:text-3xl text-[#f3f1ea] mb-1">
        ANALYZING YOUR ENTIRE LIFE...
      </h2>
      <p className="font-mono text-xs text-[#948f9c] mb-6">
        Cross-referencing incident with all previous traumas since middle school.
      </p>

      {/* High-Tech Sonar Radar with Heartbeat Monitor */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full border border-[#5dffa8]/40 bg-[radial-gradient(circle,rgba(93,255,168,0.08)_0%,transparent_70%)] mb-6 flex items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(93,255,168,0.15)]">
        {/* Radar concentric rings */}
        <div className="absolute inset-8 rounded-full border border-[#5dffa8]/25"></div>
        <div className="absolute inset-16 rounded-full border border-[#5dffa8]/15"></div>
        <div className="absolute inset-24 rounded-full border border-[#5dffa8]/10"></div>

        {/* Sweep beam */}
        <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,rgba(93,255,168,0.65),transparent_35%)] animate-[spin_2s_linear_infinite]"></div>

        {/* EKG Heartbeat waveform inside the radar */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
          <canvas ref={canvasRef} width={180} height={60} className="w-36 h-12 opacity-80" />
          <div className="flex items-center gap-1 text-[11px] font-mono text-[#ff5fd1] mt-1 bg-[#0a0a0c]/80 px-2 py-0.5 rounded-full border border-[#ff5fd1]/30">
            <HeartPulse className="w-3 h-3 text-[#ff5fd1] animate-ping" />
            <span>PULSE: {Math.floor(75 + (progress / 100) * 105)} BPM</span>
          </div>
        </div>
      </div>

      {/* Floating Thought Bubbles Field */}
      <div className="relative w-full h-32 overflow-hidden mb-4 bg-[#0d0d10]/60 border border-[#312d38]/50 rounded-xl">
        {bubbles.map((b) => (
          <div
            key={b.id}
            style={{ left: `${b.left}%` }}
            className="absolute bottom-0 font-mono text-[11px] px-3 py-1.5 rounded-full bg-[#1c1822] border border-[#ff5fd1]/40 text-[#ffd7f4] shadow-lg animate-in slide-in-from-bottom-6 fade-in duration-500 whitespace-nowrap"
          >
            {b.text}
          </div>
        ))}
      </div>

      {/* Progress Bar with Panic Gauge */}
      <div className="w-full max-w-lg mb-4 font-mono">
        <div className="flex justify-between items-center text-xs mb-1.5">
          <span className="text-[#948f9c] flex items-center gap-1">
            <Radio className="w-3 h-3 text-[#ffd23f]" />
            {currentLabel}
          </span>
          <span className="text-[#5dffa8] font-bold text-sm">{progress}%</span>
        </div>

        <div className="w-full h-3 rounded-full bg-[#0d0d10] border border-[#312d38] p-0.5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#5dffa8] via-[#ffd23f] to-[#ff5fd1] transition-all duration-300 shadow-[0_0_10px_rgba(255,95,209,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Mood Conclusion Readout */}
      {moodResult && (
        <div className="font-mono text-sm sm:text-base font-bold text-[#ffd23f] bg-[#1a1720] border border-[#ffd23f]/50 px-4 py-2.5 rounded-xl animate-in zoom-in-95 duration-200 mt-2 shadow-2xl flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[#ffd23f]" />
          {moodResult}
        </div>
      )}
    </div>
  );
};
