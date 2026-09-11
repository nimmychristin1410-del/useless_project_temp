import React, { useEffect, useState } from "react";
import { IncidentFormData } from "../types";
import { getIncidentSymptoms, UNHINGED_BONUS_SYMPTOMS } from "../data/incidentData";
import { sound } from "../utils/soundEngine";
import { CheckSquare, Flame, Sparkles, ArrowLeft, ArrowRight } from "lucide-react";

interface ChecklistScreenProps {
  formData: IncidentFormData;
  selectedSymptoms: string[];
  onToggleSymptom: (symptom: string) => void;
  onProceed: () => void;
  onBack: () => void;
}

export const ChecklistScreen: React.FC<ChecklistScreenProps> = ({
  formData,
  selectedSymptoms,
  onToggleSymptom,
  onProceed,
  onBack
}) => {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [shaking, setShaking] = useState<boolean>(false);

  useEffect(() => {
    const list = getIncidentSymptoms(formData.incidentText, formData.category);
    setSymptoms(list);
  }, [formData.incidentText, formData.category]);

  const handleChipClick = (symptom: string, isUnhinged: boolean = false) => {
    sound.unlock();
    const isCurrentlySelected = selectedSymptoms.includes(symptom);
    sound.playChipToggle(!isCurrentlySelected);

    if (isUnhinged && !isCurrentlySelected) {
      sound.playGlitchSound();
      setShaking(true);
      setTimeout(() => setShaking(false), 350);
    }

    onToggleSymptom(symptom);
  };

  const truncatedIncident =
    formData.incidentText.length > 50
      ? formData.incidentText.slice(0, 48) + "..."
      : formData.incidentText;

  return (
    <div className={`w-full max-w-2xl mx-auto py-4 px-3 sm:px-4 animate-in fade-in duration-300 ${shaking ? "animate-pulse" : ""}`}>
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#ff5fd1] tracking-widest border border-[#ff5fd1]/40 rounded-full px-3 py-1 mb-2 bg-[#ff5fd1]/10">
          <CheckSquare className="w-3 h-3" /> STEP 2 OF 4 — INCIDENT SYMPTOM AUDIT
        </div>
        <h2 className="font-['Unbounded',sans-serif] font-bold text-2xl sm:text-3xl text-[#f3f1ea]">
          EVIDENCE OF OVERTHINKING
        </h2>
        <p className="text-xs sm:text-sm text-[#948f9c] font-mono mt-1 max-w-lg mx-auto">
          Tailored to your incident: <span className="text-[#ffd23f] italic font-medium">"{truncatedIncident}"</span>
        </p>

        <div className="mt-3 inline-block font-mono text-xs bg-[#151318] border border-[#312d38] rounded-full px-4 py-1.5 text-[#f3f1ea]">
          <span className="text-[#ff5fd1] font-bold text-sm">{selectedSymptoms.length}</span> confirmed symptoms registered
        </div>
      </div>

      {/* Primary Contextual Symptoms */}
      <div className="flex flex-wrap gap-2.5 justify-center mb-6">
        {symptoms.map((symptom, idx) => {
          const isSelected = selectedSymptoms.includes(symptom);
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleChipClick(symptom, false)}
              className={`font-mono text-xs px-3.5 py-2 rounded-full border transition-all cursor-pointer select-none text-left ${
                isSelected
                  ? "bg-[#ff5fd1]/20 border-[#ff5fd1] text-[#ffd7f4] shadow-[0_0_8px_rgba(255,95,209,0.2)]"
                  : "bg-[#151318] border-[#312d38] text-[#948f9c] hover:border-[#ff5fd1]/60 hover:text-[#f3f1ea]"
              }`}
            >
              {isSelected ? "✓ " : "+ "}
              {symptom}
            </button>
          );
        })}
      </div>

      {/* Unhinged Bonus Symptoms */}
      <div className="bg-[#110e17] border border-[#ffd23f]/30 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-center gap-1.5 font-['Unbounded',sans-serif] text-xs font-bold text-[#ffd23f] mb-3 tracking-wide">
          <Flame className="w-3.5 h-3.5 text-[#ff4545] animate-bounce" />
          🤡 BONUS SYMPTOMS (UNHINGED SPIRAL MODE)
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {UNHINGED_BONUS_SYMPTOMS.map((bonus, idx) => {
            const isSelected = selectedSymptoms.includes(bonus);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleChipClick(bonus, true)}
                className={`font-mono text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer text-left ${
                  isSelected
                    ? "bg-[#ff4545]/25 border-[#ff4545] text-[#ffb3b3] shadow-[0_0_10px_rgba(255,69,69,0.3)]"
                    : "bg-[#1c1822] border-[#3d3647] text-[#c9c3d6] hover:border-[#ffd23f]"
                }`}
              >
                {isSelected ? "💀 " : "⚡ "}
                {bonus}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onBack();
          }}
          className="px-4 py-3.5 rounded-xl font-mono text-xs text-[#948f9c] hover:text-[#f3f1ea] border border-[#312d38] hover:bg-[#1a1720] transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>

        <button
          id="btn-to-analyzing"
          type="button"
          onClick={() => {
            sound.unlock();
            sound.playClick();
            onProceed();
          }}
          className="flex-1 py-4 px-6 rounded-xl font-mono font-bold text-sm bg-[#ff5fd1] hover:bg-[#ff7be0] text-[#0a0a0c] shadow-[0_6px_0_#a13488] active:translate-y-1 active:shadow-[0_2px_0_#a13488] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>CALCULATE MY DOOM WITH PANIC AUDIO →</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
